let socketPromise = null;

export function getSocket() {
  if (socketPromise) return socketPromise;

  socketPromise = new Promise((resolve, reject) => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    if (window.io) return resolve(window.io(socketUrl, { withCredentials: true }));

    const existing = document.querySelector('script[data-socket-io-client]');
    if (existing) {
      existing.addEventListener("load", () => {
        if (!window.io) return reject(new Error("Socket.IO client failed to load"));
        resolve(window.io(socketUrl, { withCredentials: true }));
      }, { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load Socket.IO client")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `${socketUrl.replace(/\/$/, "")}/socket.io/socket.io.js`;
    script.async = true;
    script.dataset.socketIoClient = "true";
    script.onload = () => {
      if (!window.io) return reject(new Error("Socket.IO client failed to load"));
      resolve(window.io(socketUrl, { withCredentials: true }));
    };
    script.onerror = () => reject(new Error("Unable to load Socket.IO client from backend"));
    document.head.appendChild(script);
  });

  return socketPromise;
}
