export type EnvVars = Record<string, string>;
export type Interval = [number, number];
export type ResolvedInterval = {
  interval: Interval;
  envValue: string | null;
};

export function lookup(s: string, interval: Interval, vars: EnvVars): ResolvedInterval {
  const pattern = s.substring(interval[0] + 2, interval[1] - 2); // exclude {{ }}
  const v = vars[pattern];
  return {
    interval,
    envValue: v || null,
  };
}

export function matchEnvs(s: string, vars: EnvVars): ResolvedInterval[] {
  const intervals: ResolvedInterval[] = [];
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
          intervals.push(lookup(s, [start, i + 1], vars));
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

export function replaceEnvVars(s: string, intervals: ResolvedInterval[]): string {
  let lastIdx = 0;
  const frags = [];
  for (let i = 0; i < intervals.length; i++) {
    const { interval, envValue } = intervals[i];
    const [start, end] = interval;

    const s1 = s.substring(lastIdx, start);

    if (envValue) {
      frags.push(s1, envValue);
    } else {
      const s2 = s.substring(start, end);
      frags.push(s1, s2);
    }
    lastIdx = end;
  }

  frags.push(s.substring(lastIdx, s.length));

  return frags.join('');
}
