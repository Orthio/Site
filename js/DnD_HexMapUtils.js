// js/DnD_HexMapUtils.js
export function getSeedFromURL() {
  const sp = new URLSearchParams(location.search);
  const s = sp.get("seed");
  if (s == null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n >>> 0 : hashStringToUint32(s);
}

export function randomUint32() {
  if (crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] >>> 0;
  }
  return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
}

export function hashStringToUint32(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return h >>> 0;
}
