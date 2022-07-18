export const range = (size, startAt = 0) =>
  [...Array(size).keys()].map(i => i + startAt);