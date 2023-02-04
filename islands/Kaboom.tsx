import kaboom from "kaboom";

const trails = new Map();
const trail = [];

const canvasRef = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) {
    return;
  }

  const { protocol, host } = location;
  const s = protocol.includes("s");
  const ws = new WebSocket(`ws${s ? "s" : ""}://${host}/api/socket`);

  ws.addEventListener("message", ({ data }) => {
    const { id, value } = JSON.parse(data, (k, v) => {
      return k === "value" && Array.isArray(v)
        ? v.map((w) => vec2(w.x, w.y))
        : v;
    });
    trails.set(id, value);
  });

  const { onDraw, onUpdate, drawLines, rgb, mousePos, vec2 } = kaboom({
    canvas,
    global: false,
  });

  onDraw(() => {
    trails.forEach((t) => {
      if (!(Array.isArray(t) && t.length)) {
        return;
      }

      drawLines({
        width: 4,
        color: rgb(0, 0, 0),
        pts: t,
      });
    });
  });

  onUpdate(() => {
    trail.push(mousePos());

    if (trail.length > 20) {
      trail.shift();
    }

    if (ws.readyState !== WebSocket.OPEN) {
      return;
    }

    ws.send(
      JSON.stringify({
        value: trail,
      })
    );
  });
};

const Kaboom = () => <canvas ref={canvasRef} />;
export default Kaboom;
