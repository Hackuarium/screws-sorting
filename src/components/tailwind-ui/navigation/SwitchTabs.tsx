import * as RadixTabs from '@radix-ui/react-tabs';
import clsx from 'clsx';
import { ReactNode } from 'react';

export interface SwitchTabsItems {
  title: ReactNode;
  content: ReactNode;

  icon?: ReactNode;
  disabled?: boolean;
}

export interface SwitchTabsProps {
  tabs: Array<SwitchTabsItems>;
  align?: 'left' | 'center' | 'right';
}

export function SwitchTabs(props: SwitchTabsProps) {
  const { tabs, align = 'left' } = props;

  return (
    <RadixTabs.Root defaultValue="0">
      <div
        className={clsx('flex', {
          'justify-start': align === 'left',
          'justify-end': align === 'right',
          'justify-center': align === 'center',
        })}
      >
        <RadixTabs.List className="flex flex-row items-center gap-2 rounded-lg bg-neutral-100 p-1">
          {tabs.map(({ title, disabled, icon }, key) => (
            <RadixTabs.Trigger
              // eslint-disable-next-line react/no-array-index-key
              key={key}
              value={String(key)}
              disabled={disabled}
              className="group rounded-md py-1 px-2 text-sm font-semibold focus:ring-2 data-[state=active]:bg-white data-[disabled]:text-neutral-500 data-[state=active]:shadow"
            >
              <div
                className={clsx('flex flex-row items-center gap-1', {
                  'lg:pr-3': icon,
                })}
              >
                {icon && (
                  <span className="h-5 w-5 group-data-[state=active]:text-primary-500">
                    {icon}
                  </span>
                )}
                <span>{title}</span>
              </div>
            </RadixTabs.Trigger>
          ))}
        </RadixTabs.List>
      </div>
      {tabs.map(({ content }, key) => (
        <RadixTabs.Content
          // eslint-disable-next-line react/no-array-index-key
          key={key}
          value={String(key)}
          className="focus:outline-none"
        >
          {content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
