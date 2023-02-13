import kaboom, { type Vec2 } from "kaboom";

const trails = new Map();
const trail: Vec2[] = [];

const canvasRef = (canvas: HTMLCanvasElement | null) => {
  if (!canvas) {
    return;
  }

  const { drawLines, mousePos, onDraw, onUpdate, rgb, vec2 } = kaboom({
    global: false,
    canvas,
  });

  const { host, protocol: p } = location;
  const protocol = `ws${p.endsWith("s:") ? "s" : ""}:`;
  const ws = new WebSocket(`${protocol}//${host}/api/socket`);

  ws.addEventListener("message", ({ data }) => {
    const { id, value } = JSON.parse(data, (k, v) => {
      return k === "value" && Array.isArray(v)
        ? v.map((w) => vec2(w.x, w.y))
        : v;
    });
    trails.set(id, value);
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
