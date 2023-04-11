// defines the real size of the picking zone
const plate = {
  origin: { x: 0, y: 0, z: 0 },
  width: 300,
  depth: 300,
};

const plateImage = {
  origin: { x: 0, y: 0, z: 0 },
  width: 300,
  depth: 300,
};

const boxes = {
  origin: { x: -200, y: -200, z: -100 },
  width: 60,
  depth: 60,
  height: 40,
  dropMargin: 20, // we drop 20 mm over the box
  nbColumns: 6,
  nbRows: 2,
};

const xFactor = plate.width / plateImage.width;
const yFactor = plate.depth / plateImage.depth;
const xShift = 0;
const yShift = 0;

export function pickAndSortGCode(gcode: string[], datum: any) {
  const xCenter = Math.round(
    (datum.origin.column + datum.width / 2) * xFactor + xShift,
  );
  const yCenter = Math.round(
    (datum.origin.row + datum.height / 2) * yFactor + yShift,
  );
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
  gcode.push(`X${xCenter} Y${yCenter}`, `Z-180`, `M4`, `Z0`, `M3`);
}

export function dropInBox(gcode: string[], boxID) {
  gcode.push(
    moveToBox(boxID),
    `Z${boxes.origin.z}${boxes.height}${boxes.dropMargin}`,
    'M3',
  );
}

/**
 * Based on the boxID, returns the GCode to move to the center of the box
 * @param boxID
 * @returns
 */
function moveToBox(boxID) {
  const xCenter =
    boxes.origin.x + (boxID % boxes.nbColumns) * boxes.width + boxes.width / 2;
  const yCenter =
    boxes.origin.y +
    Math.floor(boxID / boxes.nbColumns) * boxes.depth +
    boxes.depth / 2;
  return `G0 X${xCenter} Y${yCenter}`;
}
