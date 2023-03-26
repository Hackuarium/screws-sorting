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
  const depth = 2;
  if (!cache[depth]) {
    const codesObject = {};
    const codes = [];

    let lastID = 0;
    next: for (let i = 0; i < depth ** 9; i++) {
      let code = Number(i).toString(depth).padStart(9, '0');
      if (
        code.split('').filter((c) => c === '1').length < 2 ||
        code.split('').filter((c) => c === '0').length < 2
      ) {
        continue;
      }
      if (codesObject[code]) {
        continue;
      }

      // need to calculate the symmetry of the code
      const alternativeCodes = getAlternativeCodex(code);
      for (let alternativeCode of alternativeCodes) {
        if (alternativeCode === code) continue;
        if (codesObject[alternativeCode]) {
          codesObject[code] = codesObject[alternativeCode];
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

const alternatives = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [7, 4, 1, 8, 5, 2, 9, 6, 3],
  [9, 8, 7, 6, 5, 4, 3, 2, 1],
  [3, 6, 9, 2, 5, 8, 1, 4, 7],
];

function getAlternativeCodex(code) {
  const codes = [];
  for (let alternative of alternatives) {
    let alternativeCode = '';
    for (let i = 0; i < code.length; i++) {
      alternativeCode += code[alternative[i] - 1];
    }
    codes.push(alternativeCode);
  }
  return codes;
}
