import { CancellationToken } from "../async/CancellationToken";

export function delayAsync(
  time: number,
  ct?: CancellationToken,
) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, time);
    ct?.register((m) => {
      clearTimeout(t);
      reject(m);
    });
  });
}

