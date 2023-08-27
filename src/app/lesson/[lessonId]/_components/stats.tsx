import { useCallback, useEffect } from "react";
import { useLessonContext } from "./lessonProvider";
import { useRouter } from "next/navigation";

type StatsProps = {
  start: number;
  stop: number;
  countOfErrors: number;
  totalKeypresses: number;
  userInput: string;
  correctlyPressedKeys: Map<string, number>;
  incorrectlyPressedKeys: Map<string, number>;
  onReset: () => void;
};

export function Stats({
  start,
  stop,
  totalKeypresses,
  countOfErrors,
  onReset,
  userInput,
  correctlyPressedKeys,
  incorrectlyPressedKeys,
}: StatsProps) {
  const {
    lesson,
    currentPage: currentPart,
    countOfPages: countOfParts,
    onNextPage: onNextPart,
  } = useLessonContext();
  const targetText = lesson.pages[currentPart].text;

  const router = useRouter();

  const passedTime = (stop - start) / 1000;

  const wpm = getWPM(userInput, passedTime);
  const adjustedWPM = getAdjustedWPM(targetText, userInput, passedTime);
  const accuracy = ((1 - countOfErrors / totalKeypresses) * 100).toFixed(1);
  const leastAccurateKeys = getLeastAccurateKeys(
    correctlyPressedKeys,
    incorrectlyPressedKeys,
  );

  const exitLesson = useCallback(() => {
    router.push("/");
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);

    function handleNavigation(event: KeyboardEvent): void {
      if (
        !(
          event.key === "r" ||
          (event.key === "n" && currentPart < countOfParts - 1) ||
          event.key === "Escape"
        )
      ) {
        return;
      }

      switch (event.key) {
        case "r":
          onReset();
          return;
        case "n":
          onNextPart();
          onReset();
          return;
        case "Escape":
          exitLesson();
          return;
      }
    }

    return () => document.removeEventListener("keydown", handleNavigation);
  }, []);

  function getAdjustedWPM(
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

    const adjustedWPM = ((60 * totalCorrectWords) / passedTime).toFixed(1);

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
    return adjustedWPM;
  }

  function getWPM(userInput: string, passedTime: number) {
    const countOfTypedWords = userInput.match(/\S+/g)?.length ?? 0;
    return ((60 * countOfTypedWords) / passedTime).toFixed(1);
  }

  function getLeastAccurateKeys(
    correctlyPressedKeys: Map<string, number>,
    incorrectlyPressedKeys: Map<string, number>,
  ) {
    const keys = new Set<string>();
    const keysWithAccuracy: { key: string; accuracy: number }[] = [];
    correctlyPressedKeys.forEach((_, key) => keys.add(key));
    incorrectlyPressedKeys.forEach((_, key) => keys.add(key));
    keys.forEach((key) => {
      const accuracy =
        (1 -
          (incorrectlyPressedKeys.get(key) ?? 0) /
            ((correctlyPressedKeys.get(key) ?? 0) +
              (incorrectlyPressedKeys.get(key) ?? 0))) *
        100;
      keysWithAccuracy.push({ key, accuracy });
    });

    const fiveLEastAccurateKeys = keysWithAccuracy
      .sort((key1, key2) => key1.accuracy - key2.accuracy)
      .slice(0, 5);
    return fiveLEastAccurateKeys;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>
          <b>Accuracy:</b> <span>{accuracy}%</span>
        </p>
        <p>
          <b>Raw WPM:</b> <span>{wpm}</span>
        </p>
        <p>
          <b>Adjusted WPM:</b> <span>{adjustedWPM}</span>
        </p>
      </div>
      {leastAccurateKeys.length !== 0 ? (
        <div>
          <h2 className="font-bold">Least accurate keys</h2>
          <ol className="list-inside list-decimal">
            {leastAccurateKeys.map((key) => (
              <li key={key.key}>
                <span className="inline-block w-[9.6px] text-center">
                  {key.key === " " ? "␣" : key.key}
                </span>{" "}
                — {key.accuracy.toFixed(1)}%
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <div className="flex gap-4">
        <button
          className="self-start rounded-md bg-black px-1 py-0.5 text-white"
          onClick={onReset}
        >
          Try again (r)
        </button>
        {currentPart < countOfParts - 1 ? (
          <button
            className="self-start rounded-md bg-black px-1 py-0.5 text-white"
            onClick={onNextPart}
          >
            Next page (n)
          </button>
        ) : null}
        <button
          className="self-start rounded-md bg-black px-1 py-0.5 text-white"
          onClick={exitLesson}
        >
          Exit lesson (Esc)
        </button>
      </div>
    </div>
  );
}
