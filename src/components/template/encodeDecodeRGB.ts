const cache = {};

export function idToCode(id: number): string {
  const codes = getCache().codes;
  if (id >= codes.length) throw new Error('id out of range');
  return codes[id];
}

export function codeToId(code: string): number {
  const codesObject = getCache().codesObject;
  return codesObject[code];
}

function getCache() {
  const depth = 3;
  if (!cache[depth]) {
    const codesObject = {};
    const codes = [];

    let lastID = 0;
    next: for (let i = 0; i < depth ** 9 - 1; i++) {
      let code = Number(i).toString(depth).padStart(9, '0');
      if (codesObject[code]) {
        continue;
      }
      for (let shift of [2, 4, 6]) {
        if (codesObject[code.slice(shift) + code.slice(0, shift)]) {
          codesObject[code] =
            codesObject[code.slice(shift) + code.slice(0, shift)];
          continue next;
        }
      }
      codesObject[code] = lastID++;
      codes.push(code);
    }
    cache[depth] = {
      codes,
      codesObject,
    };
  }
  return cache[depth];
}
