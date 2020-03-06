import React from 'react';
import TooltipSpan from './TooltipSpan';

type EnvVars = Record<string, string>;

type Interval = [number, number];

type ColorInterval = {
  interval: Interval;
  color: string;
  hoverText?: string;
};

export function match(s: string, interval: Interval, vars: EnvVars): ColorInterval {
  const pattern = s.substring(interval[0] + 2, interval[1] - 2); // exclude {{ }}
  const v = vars[pattern];
  return {
    interval,
    color: v ? 'orange' : 'red',
    hoverText: v,
  };
}

export function colorIntervals(s: string, vars: EnvVars): ColorInterval[] {
  const intervals: ColorInterval[] = [];
  const stack = [];
  let state = 0; // 0 - default // 1 - 1 "{" // 2 - 1 "}"
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '{') {
      if (state === 1) {
        stack.push(i - 1);
        state = 0;
      } else {
        state = 1;
      }
    } else if (s[i] === '}') {
      if (state === 2) {
        const start = stack.pop();
        if (stack.length === 0 && start != null) {
          intervals.push(match(s, [start, i + 1], vars));
        }
        state = 0;
      } else {
        state = 2;
      }
    } else {
      state = 0;
    }
  }
  return intervals;
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
      <TooltipSpan key={2 * i + 1} text={colored} color={color} tooltip={hoverText} />,
    );
  }
  nodes.push(<span key={nodes.length}>{s.substring(lastIdx, s.length)}</span>);

  return <span style={{ color: 'gray' }}>{nodes}</span>;
}
