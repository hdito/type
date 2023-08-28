export function getWPM(userInput: string, passedTime: number) {
  const countOfTypedWords = userInput.match(/\S+/g)?.length ?? 0;
  const wpm = (60 * countOfTypedWords) / passedTime;

  if (isNaN(wpm)) {
    return "-";
  }
  return wpm.toFixed();
}
