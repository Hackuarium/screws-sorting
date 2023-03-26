import { idToCode } from './encodeDecode';

export default function CodeRGB(props) {
  const { id, x, y, depth = 2 } = props;

  const code = idToCode(id);
  const colors = depth === 2 ? ['red', 'white'] : ['red', 'green', 'blue'];
  const pixels = [];

  for (let i = 0; i < 9; i++) {
    const pixel = code[i];
    const color = colors[pixel];
    pixels.push(
      <rect
        x={(i % 3) + 1}
        y={Math.floor(i / 3) + 1}
        width="1"
        height="1"
        strokeWidth="0"
        stroke={color}
        fill={color}
      />,
    );
  }

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x="0.5"
        y="0.5"
        width="4"
        height="4"
        strokeWidth="1"
        stroke="black"
        fill="white"
      />

      {pixels}
    </g>
  );
}
