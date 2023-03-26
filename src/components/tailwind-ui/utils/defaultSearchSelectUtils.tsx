import { ReactNode, UIEvent } from 'react';

import { SimpleSelectOption } from '../forms/basic/Select';
import { Color } from '../types';

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '');
}

export function defaultOptionsFilter<OptionType extends SimpleSelectOption>(
  query: string,
  options: OptionType[],
): OptionType[] {
  const normalizedQuery = normalize(query);
  return options.filter((option) =>
    normalize(String(defaultRenderOption(option))).includes(normalizedQuery),
  );
}

export function customOptionsFilter<OptionType>(
  getText: (option: OptionType) => string,
) {
  return (query: string, options: Array<OptionType>) => {
    const normalizedQuery = normalize(query);
    return options.filter((obj) =>
      normalize(getText(obj)).includes(normalizedQuery),
    );
  };
}

export function defaultRenderSelectedOptions(options: unknown[]): ReactNode {
  if (options.length === 0) return null;
  return `${options.length} item${options.length > 1 ? 's' : ''} selected`;
}

export function defaultGetValue(option: SimpleSelectOption): string | number {
  return typeof option === 'object' ? option.value : option;
}

export function defaultCanCreate() {
  return true;
}

export function defaultRenderCreate(value: string) {
  return `Create "${value}"`;
}

export function defaultGetBadgeColor() {
  return Color.neutral;
}

export function defaultIsOptionRemovable() {
  return true;
}

export function preventDefault(event: UIEvent) {
  event.preventDefault();
}

export function defaultRenderOption(option: SimpleSelectOption): ReactNode {
  return typeof option === 'object' ? option.label : option;
}

export const defaultNoResultsHint = <div>No results.</div>;
