import Code from './Code';

const width = 13;
const height = 9;
const delta = 25;

export default function Template() {
  const codes = [];
  for (let col = 0; col < width; col++) {
    for (let row = 0; row < height; row++) {
      const id = row * width + col;
      codes.push(<Code id={id} x={col * delta} y={row * delta} />);
    }
  }
  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${(width + 1) * delta} ${(height + 1) * delta}`}
    >
      {codes}
    </svg>
  );

  return svg;
}
