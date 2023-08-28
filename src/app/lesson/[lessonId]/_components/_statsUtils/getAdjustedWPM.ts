export function getAdjustedWPM(
  targetString: string,
  userInput: string,
  passedTime: number,
) {
  const userKeys = userInput.split("\n").map((line) => line.split(""));
  const targetKeys = targetString.split("\n").map((line) => line.split(""));

  const userWords = getWordsMap(userKeys);
  const targetWords = getWordsMap(targetKeys);

  let totalCorrectWords = 0;

  targetWords.forEach((value, key) => {
    if (userWords.get(key) !== value) return;
    totalCorrectWords++;
  });

  const adjustedWPM = (60 * totalCorrectWords) / passedTime;

  if (isNaN(adjustedWPM)) {
    return "-";
  }
  return adjustedWPM.toFixed();

  function getWordsMap(keys: string[][]) {
    const words = new Map<string, string>();

    for (let i = 0; i < keys.length; i++) {
      const line = keys[i];
      let currentWord: { start: number; word: string } | null = null;

      for (let j = 0; j < line.length; j++) {
        const key = line[j];

        if (key !== " ") {
          if (currentWord !== null) {
            currentWord.word = currentWord.word + key;
            words.set(
              i.toString(16).padStart(2, "0") + currentWord.start,
              currentWord.word,
            );
            continue;
          }
          currentWord = { start: j, word: key };
          words.set(i.toString(16).padStart(2, "0") + currentWord.start, key);
          continue;
        }

        if (currentWord === null) continue;
        currentWord = null;
      }
    }
    return words;
  }
}
