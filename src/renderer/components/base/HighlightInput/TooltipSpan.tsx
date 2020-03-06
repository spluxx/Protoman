import React from 'react';
import ReactTooltip from 'react-tooltip';

/**
 *  It's such a waste to listen to window mouse events, but since the current implementation of
 *  HighlightInput blocks off mouse input to the highlighted texts, there's not much better way...
 */

type TooltipSpanProps = {
  id?: string;
  text: string;
  color?: string;
  tooltip?: string;
};

const TooltipSpan: React.FunctionComponent<TooltipSpanProps> = ({ id, text, color, tooltip }) => {
  const spanRef = React.useRef<HTMLSpanElement>(null);
  const nonce = React.useMemo(() => {
    return Math.floor(Math.random() * 100007);
  }, []);
  const nID = `${nonce}${id || ''}`;

  React.useEffect(() => {
    const checkHover = (evt: MouseEvent): void => {
      if (spanRef.current) {
        const { left, right, top, bottom } = spanRef.current.getBoundingClientRect();
        const isInside = left <= evt.clientX && evt.clientX <= right && top <= evt.clientY && evt.clientY <= bottom;
        if (isInside) {
          ReactTooltip.show(spanRef.current);
        } else {
          ReactTooltip.hide(spanRef.current);
        }
      }
    };
    window.addEventListener('mousemove', checkHover);
    return (): void => {
      window.removeEventListener('mousemove', checkHover);
    };
  }, [spanRef.current]);

  return (
    <>
      <span ref={spanRef} style={{ color }} data-tip={tooltip || ''} data-for={nID}>
        {text}
      </span>
      <ReactTooltip id={nID} />
    </>
  );
};

export default TooltipSpan;
