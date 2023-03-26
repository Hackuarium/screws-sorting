import { ReactNode } from 'react';

import { Tooltip, TooltipProps } from './Tooltip';

export interface WithTooltipProps {
  tooltip?: ReactNode;
  tooltipDelay?: TooltipProps['delay'];
  tooltipPlacement?: TooltipProps['placement'];
}

export function WithTooltip(props: WithTooltipProps & { children: ReactNode }) {
  const { children, tooltip, tooltipDelay, tooltipPlacement } = props;

  if (tooltip) {
    return (
      <Tooltip delay={tooltipDelay} placement={tooltipPlacement}>
        <Tooltip.Content>{tooltip}</Tooltip.Content>
        <Tooltip.Target>{children}</Tooltip.Target>
      </Tooltip>
    );
  }

  return <>{children}</>;
}
