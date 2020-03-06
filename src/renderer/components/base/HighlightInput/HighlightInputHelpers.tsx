import React from 'react';
import TooltipSpan from './TooltipSpan';
import { EnvVars, Interval, matchEnvs, ResolvedInterval } from '../../../../core/env';

type ColorInterval = {
  interval: Interval;
  color: string;
  hoverText?: string;
};

function toColored(rInterval: ResolvedInterval): ColorInterval {
  const { interval, envValue } = rInterval;
  return {
    interval,
    color: envValue ? 'orange' : 'red',
    hoverText: envValue || undefined,
  };
}

export function colorIntervals(s: string, vars: EnvVars): ColorInterval[] {
  return matchEnvs(s, vars).map(toColored);
}

// color intervals should not overlap, and sorted in ascending order
export function materializeSpans(s: string, csArr: ColorInterval[]): React.ReactNode {
  let lastIdx = 0;
  const nodes = [];
  for (let i = 0; i < csArr.length; i++) {
    const { interval, color, hoverText } = csArr[i];
    const [start, end] = interval;

    const plain = s.substring(lastIdx, start);
    const colored = s.substring(start, end);

    lastIdx = end;

    nodes.push(
      <span key={2 * i}>{plain}</span>,
      <TooltipSpan key={2 * i + 1} id={`tt${2 * i + 1}`} text={colored} color={color} tooltip={hoverText} />,
    );
  }
  nodes.push(<span key={nodes.length}>{s.substring(lastIdx, s.length)}</span>);

  return <span style={{ color: 'gray' }}>{nodes}</span>;
}
