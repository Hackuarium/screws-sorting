import { Roi } from 'image-js';

export default function RoiAnnotations(props) {
  const { width = 0, height = 0, rois, roiOptions } = props;
  if (!rois) return;
  const annotations = [];
  for (const roi of rois) {
    annotations.push(
      <RoiAnnotation key={roi.id} roi={roi} roiOptions={roiOptions} />,
    );
  }
  const svg = (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
      >
        {annotations}
      </svg>
    </div>
  );

  return svg;
}

function RoiAnnotation(props) {
  const { roi, roiOptions } = props;
  const x = roi.origin.column;
  const y = roi.origin.row;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Box roi={roi} roiOptions={roiOptions} />
      <Feret roi={roi} roiOptions={roiOptions} />
      <Mbr roi={roi} roiOptions={roiOptions} />
      <ConvexHull roi={roi} roiOptions={roiOptions} />
    </g>
  );
}

function Box(props: { roi: Roi; roiOptions?: any }) {
  const { roi, roiOptions = {} } = props;
  const { label = (roi) => roi.surface } = roiOptions;
  return (
    <>
      <rect
        x="0"
        y="0"
        width={roi.width}
        height={roi.height}
        style={{ strokeWidth: '1', stroke: 'black', fill: 'red', opacity: 0.1 }}
      />
      <text
        x={roi.width / 2}
        y={roi.height / 2}
        alignmentBaseline="middle"
        textAnchor="middle"
        stroke="none"
        fontSize="24"
        fill="black"
      >
        {label(roi)}
      </text>
    </>
  );
}

function Feret(props: { roi: Roi; roiOptions?: any }) {
  const { roi } = props;
  return (
    <>
      <line
        x1={roi.feret.maxDiameter.points[0].column}
        y1={roi.feret.maxDiameter.points[0].row}
        x2={roi.feret.maxDiameter.points[1].column}
        y2={roi.feret.maxDiameter.points[1].row}
        style={{ stroke: 'black', strokeWidth: 1 }}
      />
      <line
        x1={roi.feret.minDiameter.points[0].column}
        y1={roi.feret.minDiameter.points[0].row}
        x2={roi.feret.minDiameter.points[1].column}
        y2={roi.feret.minDiameter.points[1].row}
        style={{ stroke: 'black', strokeWidth: 1 }}
      />
    </>
  );
}

function Mbr(props: { roi: Roi; roiOptions?: any }) {
  const { roi } = props;
  const polygon = roi.mbr.points
    .map((corner) => `${corner.column},${corner.row}`)
    .join(' ');
  return (
    <polygon
      points={polygon}
      style={{ fill: 'none', stroke: 'blue', strokeWidth: 1 }}
    />
  );
}

function ConvexHull(props: { roi: Roi; roiOptions?: any }) {
  const { roi } = props;
  const polygon = roi.convexHull.points
    .map((corner) => `${corner.column},${corner.row}`)
    .join(' ');
  return (
    <polygon
      points={polygon}
      style={{ fill: 'none', stroke: 'red', strokeWidth: 2 }}
    />
  );
}
