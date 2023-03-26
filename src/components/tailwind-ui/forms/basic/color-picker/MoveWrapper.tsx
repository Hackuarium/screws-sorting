import { useRef } from 'react';

import { Position } from './types';

interface MoveWrapperProps {
  className?: string;
  style?: React.CSSProperties;
  onChange: (position: Position) => void;
  children: JSX.Element;
}

export function MoveWrapper(props: MoveWrapperProps) {
  const { className, style, onChange, children } = props;
  const divRef = useRef<HTMLDivElement>(null);

  function move(event: MouseEvent | React.MouseEvent): void {
    if (divRef.current) {
      const { current: div } = divRef;
      const { width, height, left, top } = div.getBoundingClientRect();

      const x = clamp(event.clientX - left, width, 0);
      const y = clamp(event.clientY - top, height, 0);

      onChange({ x, y });
    }
  }

  function onMouseDown(event: MouseEvent | React.MouseEvent): void {
    if (event.button !== 0) return;

    move(event);

    function onMouseMove(e: MouseEvent) {
      move(e);
    }

    function onMouseUp(e: MouseEvent) {
      document.removeEventListener('mousemove', onMouseMove, false);
      document.removeEventListener('mouseup', onMouseUp, false);

      move(e);
    }

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  }

  return (
    <div
      ref={divRef}
      className={className}
      style={style}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}

function clamp(value: number, max: number, min: number) {
  return value > max ? max : value < min ? min : value;
}
