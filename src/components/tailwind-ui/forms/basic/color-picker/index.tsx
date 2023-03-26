import { useMemo, useRef, useState } from 'react';
import tailwindColors from 'tailwindcss/colors';

import { MoveWrapper } from './MoveWrapper';
import { Position } from './types';
import { transformColor } from './utils';

type TailwindColor =
  | 'amber'
  | 'blue'
  | 'cyan'
  | 'emerald'
  | 'fuchsia'
  | 'gray'
  | 'green'
  | 'indigo'
  | 'lime'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'purple'
  | 'red'
  | 'rose'
  | 'sky'
  | 'slate'
  | 'stone'
  | 'teal'
  | 'violet'
  | 'yellow'
  | 'zinc';

type TailwindShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface ColorPickerPresetColor {
  color: TailwindColor;
  shade?: TailwindShade;
}

interface BlackAndWhiteColorPickerPresetColor {
  color: 'black' | 'white';
}

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;

  presetColors: Array<
    ColorPickerPresetColor | BlackAndWhiteColorPickerPresetColor
  >;
}

function makeStringFromTailwind(
  presetColors: ColorPickerPresetColor | BlackAndWhiteColorPickerPresetColor,
) {
  if (presetColors.color === 'black' || presetColors.color === 'white') {
    return tailwindColors[presetColors.color];
  }

  const { color, shade = 500 } = presetColors as ColorPickerPresetColor;
  return tailwindColors[color][shade];
}

const WIDTH = 214;
const HEIGHT = 150;

export function ColorPicker(props: ColorPickerProps) {
  const { color, onChange, presetColors } = props;

  const [selfColor, setSelfColor] = useState(transformColor('hex', color));
  const innerDivRef = useRef(null);

  const saturationPosition = useMemo(
    () => ({
      x: (selfColor.hsv.s / 100) * WIDTH,
      y: ((100 - selfColor.hsv.v) / 100) * HEIGHT,
    }),
    [selfColor.hsv.s, selfColor.hsv.v],
  );

  const huePosition = useMemo(
    () => ({
      x: (selfColor.hsv.h / 360) * WIDTH,
    }),
    [selfColor.hsv],
  );

  function onMoveSaturation(position: Position) {
    const { x, y } = position;

    const newHsv = {
      ...selfColor.hsv,
      s: (x / WIDTH) * 100,
      v: 100 - (y / HEIGHT) * 100,
    };

    setSelfColor(transformColor('hsv', newHsv));
    onChange(transformColor('hsv', newHsv).hex);
  }

  function onMoveHue(position: Position) {
    const { x } = position;
    const newHsv = { ...selfColor.hsv, h: (x / WIDTH) * 360 };
    const newColor = transformColor('hsv', newHsv);

    setSelfColor(newColor);
    onChange(newColor.hex);
  }

  return (
    <div
      className="flex flex-col gap-3 p-3"
      style={{
        width: WIDTH,
      }}
      ref={innerDivRef}
    >
      <MoveWrapper
        className="relative h-36 w-full select-none"
        style={{
          backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
          backgroundImage:
            'linear-gradient(transparent, black), linear-gradient(to right, white, transparent)',
        }}
        onChange={onMoveSaturation}
      >
        <div
          className="absolute h-5 w-5 rounded-full border border-neutral-200 shadow-md"
          style={{
            transform: 'translate(-10px, -10px)',
            backgroundColor: selfColor.hex,
            left: saturationPosition.x,
            top: saturationPosition.y,
          }}
        />
      </MoveWrapper>
      <MoveWrapper
        className="relative h-3 w-full select-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0),rgb(0, 255, 255),rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0)',
        }}
        onChange={onMoveHue}
      >
        <div
          className="absolute h-5 w-5 rounded-full border border-neutral-200 shadow-md"
          style={{
            transform: 'translate(-10px, -4px)',
            backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
            left: huePosition.x,
          }}
        />
      </MoveWrapper>
      <div className="m-0 flex flex-wrap gap-2 p-0">
        {presetColors.map(makeStringFromTailwind).map((basicColor) => (
          <button
            type="button"
            className="shadow-sm' h-4 w-4 cursor-pointer rounded-md border border-neutral-200"
            key={basicColor}
            style={{
              backgroundColor: basicColor,
            }}
            onClick={() => {
              setSelfColor(transformColor('hex', basicColor));
              onChange(basicColor);
            }}
          />
        ))}
      </div>
    </div>
  );
}
