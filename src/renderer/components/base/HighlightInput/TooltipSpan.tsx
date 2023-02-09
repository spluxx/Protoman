import React, { useState } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
  const [open, setIsOpen] = useState(false);

  React.useEffect(() => {
    const checkHover = (evt: MouseEvent): void => {
      if (spanRef.current) {
        const { left, right, top, bottom } = spanRef.current.getBoundingClientRect();
        const isInside = left <= evt.clientX && evt.clientX <= right && top <= evt.clientY && evt.clientY <= bottom;
        if (isInside) {
          // ReactTooltip.show(spanRef.current);
          setIsOpen(true);
        } else {
          // ReactTooltip.hide(spanRef.current);
          setIsOpen(false);
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
      <span ref={spanRef} id={`span-ref-${nID}`} style={{ color }} data-tooltip-content={tooltip || ''} data-for={nID}>
        {text}
      </span>
      <ReactTooltip id={nID} isOpen={open} anchorId={`span-ref-${nID}`} content={tooltip || ''} />
    </>
  );
};

export default TooltipSpan;
