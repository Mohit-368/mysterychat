import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib";
import { useAuth } from "../context";
import { getSocket } from "../socket";

export default function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [showCreate, setShowCreate] = useState(false);

  const socketRef = useRef(null);
  const bottom = useRef(null);

  const loadGroups = useCallback(async () => {
    try {
      const data = await api("/groups");

      setGroups(data.groups || []);

      setSelected((current) => {
        if (
          current &&
          data.groups.some((g) => g.id === current.id)
        ) {
          return data.groups.find((g) => g.id === current.id);
        }

        return data.groups[0] || null;
      });
    } catch (e) {
      setError(e.message);
    }
  }, []);

  const loadMessages = useCallback(async (group) => {
    if (!group?.id || !group?.role) return;

    try {
      const data = await api(
        `/groups/${group.id}/messages?limit=100`
      );

      setMessages(data.messages || []);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  /*
   * Load rooms
   */
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  /*
   * Socket.IO connection
   */
  useEffect(() => {
    let active = true;

    getSocket()
      .then((socket) => {
        if (!active) {
          socket.disconnect();
          return;
        }

        socketRef.current = socket;

        const onConnect = () => {
          setSocketStatus("connected");
          setError("");
        };

        const onDisconnect = () => {
          setSocketStatus("disconnected");
        };

        const onConnectError = (e) => {
          setSocketStatus("error");
          setError(
            e.message || "Real-time connection failed"
          );
        };

        const onNewMessage = (message) => {
          setMessages((current) => {
            const exists = current.some(
              (m) => String(m.id) === String(message.id)
            );

            if (exists) {
              return current;
            }

            return [...current, message];
          });
        };

        const onMessageError = (e) => {
          setError(
            e?.message || "Unable to send message"
          );
        };

        const onRoomError = (e) => {
          setError(
            e?.message || "Unable to join room"
          );
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.on("new-message", onNewMessage);
        socket.on("message-error", onMessageError);
        socket.on("room-error", onRoomError);

        if (socket.connected) {
          onConnect();
        }
      })
      .catch((e) => {
        if (active) {
          setSocketStatus("error");
          setError(e.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  /*
   * Join selected room through Socket.IO
   */
  useEffect(() => {
    setMessages([]);

    loadMessages(selected);

    const socket = socketRef.current;

    if (!socket || !selected?.role) {
      return;
    }

    socket.emit("join-room", selected.id);

    return () => {
      socket.emit("leave-room");
    };
  }, [
    selected?.id,
    selected?.role,
    loadMessages,
  ]);

  /*
   * Scroll to latest message
   */
  useEffect(() => {
    bottom.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  /*
   * Join room
   */
  async function join(group) {
    try {
      const data = await api(
        `/groups/${group.id}/join`,
        {
          method: "POST",
        }
      );

      setGroups((current) =>
        current.map((g) =>
          g.id === group.id
            ? {
                ...g,
                role: "member",
                memberCount:
                  (g.memberCount || 0) + 1,
              }
            : g
        )
      );

      setSelected({
        ...group,
        ...(data.group || {}),
        role: "member",
        memberCount:
          (group.memberCount || 0) + 1,
      });
    } catch (e) {
      setError(e.message);
    }
  }

  /*
   * Leave room
   */
  async function leave() {
    if (
      !selected ||
      selected.role === "admin"
    ) {
      return;
    }

    try {
      await api(
        `/groups/${selected.id}/leave`,
        {
          method: "POST",
        }
      );

      socketRef.current?.emit("leave-room");

      setMessages([]);

      await loadGroups();
    } catch (e) {
      setError(e.message);
    }
  }

  /*
   * Send chat message
   */
  function send(e) {
    e?.preventDefault();

    const content = text.trim();

    if (!content || !selected?.role) {
      return;
    }

    const socket = socketRef.current;

    if (!socket?.connected) {
      setError(
        "Real-time connection is not available"
      );
      return;
    }

    socket.emit("send-message", {
      content,
    });

    setText("");
  }

  /*
   * Handle Enter / Shift + Enter
   *
   * Enter       -> send message
   * Shift+Enter -> new line
   */
  function handleMessageKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (
        text.trim() &&
        socketStatus === "connected"
      ) {
        send(e);
      }
    }
  }

  /*
   * Logout
   */
  async function signOut() {
    socketRef.current?.disconnect();

    await logout();

    navigate("/", {
      replace: true,
    });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 h-[calc(100vh-5rem)]">
        <div className="h-full grid lg:grid-cols-[330px_1fr] gap-4">

          {/* SIDEBAR */}
          <aside className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-4 flex flex-col min-h-0">

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-blue-400 uppercase tracking-widest">
                  Operator
                </p>

                <p className="font-semibold">
                  {user?.username}
                </p>
              </div>

              <button
                onClick={signOut}
                className="text-xs text-gray-500 hover:text-white"
              >
                Logout
              </button>
            </div>

            {/* SOCKET STATUS */}
            <div className="mb-4 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Realtime
              </span>

              <span
                className={
                  socketStatus === "connected"
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {socketStatus}
              </span>
            </div>

            {/* CREATE ROOM */}
            <button
              onClick={() => setShowCreate(true)}
              className="w-full bg-white text-black rounded-xl py-3 text-sm font-medium mb-4"
            >
              + Create room
            </button>

            {/* ROOMS */}
            <div className="flex-1 overflow-y-auto space-y-2">

              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelected(g)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    selected?.id === g.id
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                  }`}
                >
                  <div className="flex justify-between gap-2">

                    <span className="font-medium truncate">
                      {g.name}
                    </span>

                    <span className="text-[10px] text-gray-500">
                      {g.memberCount}
                    </span>

                  </div>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {g.description}
                  </p>

                  <div className="mt-3 text-[10px] uppercase tracking-widest text-blue-400">
                    {g.role
                      ? `Joined · ${g.role}`
                      : "Available"}
                  </div>
                </button>
              ))}

              {!groups.length && (
                <div className="text-center text-gray-600 text-sm py-10">
                  No rooms yet. Create the first one.
                </div>
              )}

            </div>
          </aside>

          {/* CHAT */}
          <section className="bg-[#0a0a0a] border border-white/10 rounded-3xl flex flex-col min-h-0 overflow-hidden">

            {selected ? (
              <>
                {/* CHAT HEADER */}
                <header className="p-5 border-b border-white/5 flex items-center justify-between gap-4">

                  <div className="min-w-0">
                    <h1 className="text-xl font-semibold truncate">
                      {selected.name}
                    </h1>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {selected.description}
                    </p>
                  </div>

                  {selected.role ? (
                    selected.role !== "admin" && (
                      <button
                        onClick={leave}
                        className="border border-white/10 px-4 py-2 rounded-xl text-sm shrink-0"
                      >
                        Leave
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => join(selected)}
                      className="bg-blue-600 px-4 py-2 rounded-xl text-sm shrink-0"
                    >
                      Join room
                    </button>
                  )}

                </header>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">

                  {selected.role ? (
                    messages.map((m) => {
                      const isMine =
                        String(m.senderId) ===
                        String(user?.id);

                      return (
                        <div
                          key={m.id}
                          className={`flex ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              isMine
                                ? "bg-blue-600 text-white"
                                : "bg-white/5 border border-white/5"
                            }`}
                          >
                            <p className="text-[10px] text-white/50 mb-1">
                              {isMine
                                ? "You"
                                : m.senderUsername ||
                                  "Anonymous"}
                            </p>

                            <p className="text-sm whitespace-pre-wrap break-words">
                              {m.content}
                            </p>

                            <p className="text-[9px] text-white/40 mt-2">
                              {m.createdAt
                                ? new Date(
                                    m.createdAt
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : ""}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-600">
                      Join this room to enter the conversation.
                    </div>
                  )}

                  {selected.role &&
                    !messages.length && (
                      <div className="text-center text-gray-600 py-10">
                        No messages yet. Start the conversation.
                      </div>
                    )}

                  <div ref={bottom} />
                </div>

                {/* MESSAGE COMPOSER */}
                {selected.role && (
                  <form
                    onSubmit={send}
                    className="p-4 border-t border-white/5 flex gap-3"
                  >
                    <textarea
                      value={text}
                      onChange={(e) =>
                        setText(e.target.value)
                      }
                      onKeyDown={handleMessageKeyDown}
                      maxLength={2000}
                      rows={1}
                      placeholder="Say something..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 resize-none"
                    />

                    <button
                      type="submit"
                      disabled={
                        !text.trim() ||
                        socketStatus !== "connected"
                      }
                      className="bg-white text-black px-5 rounded-xl font-medium disabled:opacity-40"
                    >
                      Send
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a room to begin.
              </div>
            )}

          </section>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <button
          onClick={() => setError("")}
          className="fixed bottom-6 right-6 max-w-sm bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm"
        >
          {error}
        </button>
      )}

      {/* CREATE ROOM */}
      {showCreate && (
        <CreateRoom
          close={() => setShowCreate(false)}
          done={async () => {
            setShowCreate(false);
            await loadGroups();
          }}
        />
      )}
    </main>
  );
}


/*
 * CREATE ROOM MODAL
 */
function CreateRoom({ close, done }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await api("/groups", {
        method: "POST",
        body: JSON.stringify(form),
      });

      await done();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-6">

      <form
        onSubmit={submit}
        className="w-full max-w-md bg-[#0b0b0b] border border-white/10 rounded-3xl p-7 space-y-5"
      >

        <div>
          <h2 className="text-xl font-semibold">
            Create a room
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Give people a reason to enter.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-300">
            {error}
          </p>
        )}

        <input
          required
          maxLength={60}
          placeholder="Room name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 outline-none"
        />

        <textarea
          required
          maxLength={240}
          rows={4}
          placeholder="What is this room about?"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 outline-none resize-none"
        />

        <div className="flex gap-3">

          <button
            type="button"
            onClick={close}
            className="flex-1 border border-white/10 rounded-xl py-3"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={busy}
            className="flex-1 bg-white text-black rounded-xl py-3 font-medium disabled:opacity-50"
          >
            {busy ? "Creating..." : "Create"}
          </button>

        </div>
      </form>
    </div>
  );
}