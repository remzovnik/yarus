export const smallerThanTstampRegex = (v: number): RegExp => {
  const arr: string[] = v.toString().split("");
  let regex = `(`;

  for (let index = 0; index < arr.length - 2; index++) {
    const currentIndex = index + 1;
    const currentChunk = arr.slice(0, currentIndex);
    const nextIndex = currentIndex + 1;
    const nextNum = +arr[currentIndex] - 1 >= 0 ? +arr[currentIndex] - 1 : 0;
    const chunksLeft = arr.length - nextIndex;

    regex += `${currentChunk.join("")}[0-${nextNum}]`;

    for (let i = 0; i < chunksLeft; i++) regex += `[0-9]`;

    regex += `*|`;
  }

  regex += `${v}*)*`;

  return new RegExp(regex);
};
