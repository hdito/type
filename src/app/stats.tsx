type StatsProps = {
  start: number;
  stop: number;
  targetText: string;
  countOfErrors: number;
  totalKeypresses: number;
  userInput: string;
  onReset: () => void;
};

export function Stats({
  start,
  stop,
  totalKeypresses,
  countOfErrors,
  onReset,
  targetText,
  userInput,
}: StatsProps) {
  const userTypedWords = userInput.split(" ");
  const countOfTypedWords = userTypedWords.length;
  const countOfCorrectTypedWords = targetText
    .split(" ")
    .reduce(
      (total, targetWord, index) =>
        targetWord === userTypedWords[index] ? total + 1 : total,
      0,
    );

  const passedTime = (stop - start) / 1000;

  const wordsPerMinute = ((60 * countOfTypedWords) / passedTime).toFixed(1);
  const adjustedWordsPerMinute = (
    (60 * countOfCorrectTypedWords) /
    passedTime
  ).toFixed(1);

  const accuracy = ((1 - countOfErrors / totalKeypresses) * 100).toFixed(1);

  return (
    <div>
      <div className="mb-4">
        <p>
          <b>Accuracy:</b> <span>{accuracy}%</span>
        </p>
        <p>
          <b>Raw WPM:</b> <span>{wordsPerMinute}</span>
        </p>
        <p>
          <b>Adjusted WPM:</b> <span>{adjustedWordsPerMinute}</span>
        </p>
      </div>
      <button
        className="rounded-md bg-black px-1 py-0.5 text-white"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
