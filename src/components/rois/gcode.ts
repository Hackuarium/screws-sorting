const xFactor = 1;
const xShift = 0;
const yFactor = 1;
const yShift = 0;

export function pickAndSortGCode(gcode: string[], datum: any) {
  const xCenter = (datum.origin.column + datum.width / 2) * xFactor + xShift;
  const yCenter = (datum.origin.row + datum.height / 2) * yFactor + yShift;
  const groupID = datum.group.id;
  gcode.push(
    `G0 X${xCenter} Y${yCenter}`,
    `G0 Z-180`,
    `M4`,
    `G0 Z0`,
    `G0 X${groupID} Y${groupID}`,
    `M3`,
  );
}

export function raiseAndDropGCode(gcode: string[], datum: any) {
  const xCenter = (datum.origin.column + datum.width / 2) * xFactor + xShift;
  const yCenter = (datum.origin.row + datum.height / 2) * yFactor + yShift;
  gcode.push(`G0 X${xCenter} Y${yCenter}`, `G0 Z-180`, `M4`, `G0 Z0`, `M3`);
}
