import React from 'react';
import { Tooltip } from 'antd';

/**
 *  It's such a waste to listen to window mouse events, but since the current implementation of
 *  HighlightInput blocks off mouse input to the highlighted texts, there's not much better way...
 */

type TooltipSpanProps = {
  text: string;
  color?: string;
  tooltip?: string;
};

const TooltipSpan: React.FunctionComponent<TooltipSpanProps> = ({ text, color, tooltip }) => {
  const [visible, setVisible] = React.useState(false);
  const spanRef = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const checkHover = (evt: MouseEvent): void => {
      if (spanRef.current) {
        const { left, right, top, bottom } = spanRef.current.getBoundingClientRect();
        const isInside = left <= evt.clientX && evt.clientX <= right && top <= evt.clientY && evt.clientY <= bottom;
        setVisible(isInside);
      }
    };
    window.addEventListener('mousemove', checkHover);
    return (): void => {
      window.removeEventListener('mousemove', checkHover);
    };
  }, [spanRef.current]);

  const inner = (
    <span ref={spanRef} style={{ color }}>
      {text}
    </span>
  );

  return tooltip ? (
    <Tooltip title={tooltip} visible={visible}>
      {inner}
    </Tooltip>
  ) : (
    inner
  );
};

export default TooltipSpan;
