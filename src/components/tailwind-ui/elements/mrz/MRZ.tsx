import clsx from 'clsx';
import { parse } from 'mrz';
import { useState } from 'react';

export interface MRZProps {
  mrz: string;
}

export function MRZ(props: MRZProps) {
  const { mrz } = props;
  const lines = mrz.split(/[\r\n]+/);
  const [hovered, setHovered] = useState<string | null>(null);
  const parsedMrz = parse(mrz, { autocorrect: true });
  return (
    <div>
      <div>
        <p className="mb-4 inline-block rounded-md border px-7 py-2 font-mono">
          {lines.map((line, i) => {
            const chars = line.split('');
            // get the fields for the current line
            return (
              <>
                {chars.map((char, j) => {
                  const detail = parsedMrz.details.find(
                    (detail) =>
                      detail.line === i && detail.start <= j && detail.end > j,
                  );
                  return detail ? (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={`${i}-${j}`}
                      className={clsx({
                        'bg-success-300':
                          detail.valid && hovered !== detail.field,
                        'bg-danger-300': !detail.valid,
                        'bg-primary-300': hovered === detail.field,
                      })}
                      onMouseEnter={() => setHovered(detail.field)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {char}
                    </span>
                  ) : (
                    <span>{char}</span>
                  );
                })}
                <br />
              </>
            );
          })}
        </p>
      </div>
      <table>
        <thead>
          <tr>
            <th className="border px-5 py-2">Label</th>
            <th className="border px-5 py-2">Value</th>
          </tr>
        </thead>
        <tbody className="cursor-default">
          {parsedMrz.details.map(({ field, label, value, valid, error }) => (
            <tr
              key={field}
              className={clsx({ 'bg-primary-300': hovered === field })}
              onMouseEnter={() => setHovered(field)}
              onMouseLeave={() => setHovered(null)}
            >
              <td className="border px-3 py-1">{label}</td>
              <td className="border px-3 py-1">
                {valid && value}
                {error && (
                  <span className="text-sm font-bold text-danger-500">
                    {error}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
