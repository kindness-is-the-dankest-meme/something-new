const sockets = new Map();

export const handler = (request: Request): Response => {
  const uuid = crypto.randomUUID();
  const { socket, response } = Deno.upgradeWebSocket(request);

  sockets.set(uuid, socket);

  socket.addEventListener("open", () =>
    socket.send(
      JSON.stringify({
        id: uuid,
        value: [],
      })
    )
  );

  socket.addEventListener("message", ({ data }) => {
    const { value } = JSON.parse(data);

    sockets.forEach((socket, key) => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      socket.send(
        JSON.stringify({
          id: uuid,
          value,
        })
      );
    });
  });

  return response;
};
