"use client";
import { enableMapSet } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useImmer } from "use-immer";
import { useLessonContext } from "./lessonProvider";
import { Line } from "./line";
import { Stats } from "./stats";

enableMapSet();

export default function LessonPage() {
  const { lesson, currentPage } = useLessonContext();
  const lessonPage = lesson.pages[currentPage];
  const targetStrings = lessonPage.text.split("\n");

  const countOfLines = targetStrings.length;

  const [userInputs, setUserInputs] = useImmer(
    new Array(countOfLines).fill(""),
  );
  const [userPositions, setUserPositions] = useImmer(
    new Array(countOfLines).fill(null),
  );
  const [countOfErrors, setCountOfErrors] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [userErrors, setUserErrors] = useImmer(
    new Array(countOfLines).fill(new Set<number>()),
  );

  const [correctlyPressedKeys, setCorrectlyPressedKeys] = useImmer(
    new Map<string, number>(),
  );
  const [incorrectlyPressedKeys, setIncorrectlyPressedKeys] = useImmer(
    new Map<string, number>(),
  );

  const [totalKeypresses, setTotalKeypresses] = useState(0);

  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [stopTimestamp, setStopTimestamp] = useState<number | null>(null);

  const isShowResults = useMemo(
    () => currentLine === countOfLines,
    [currentLine, countOfLines],
  );

  const reset = useCallback(() => {
    setUserInputs(new Array(countOfLines).fill(""));
    setUserPositions(new Array(countOfLines).fill(null));
    setCountOfErrors(0);
    setTotalKeypresses(0);
    setCurrentLine(0);
    setStartTimestamp(null);
    setStopTimestamp(null);
    setCorrectlyPressedKeys(new Map<string, number>());
    setIncorrectlyPressedKeys(new Map<string, number>());
  }, [countOfLines]);

  useEffect(() => {
    function handleKeys(event: KeyboardEvent): void {
      if (
        !(
          event.key === "Backspace" ||
          event.key === "Enter" ||
          event.key.length === 1
        )
      )
        return;

      if (startTimestamp === null) {
        setStartTimestamp(Date.now());
      }

      switch (event.key) {
        case "Backspace":
          handleBackspace();
          return;
        case "Enter":
          handleEnter();
          return;
        default:
          handleChar();
      }

      function handleBackspace() {
        if (
          userPositions[currentLine] !== null &&
          userErrors[currentLine].has(userPositions[currentLine])
        ) {
          setUserErrors((errors) => {
            errors[currentLine].delete(userPositions[currentLine]);
          });
        }
        const currentPosition =
          userPositions[currentLine] === 0 ||
          userPositions[currentLine] === null
            ? null
            : userPositions[currentLine] - 1;
        const currentUserInput = userInputs[currentLine].slice(0, -1);

        setUserPositions((positions) => {
          positions[currentLine] = currentPosition;
        });
        setUserInputs((userInputs) => {
          userInputs[currentLine] = currentUserInput;
        });
      }

      function handleChar() {
        setTotalKeypresses((prev) => prev + 1);
        const currentPosition =
          userPositions[currentLine] === null
            ? 0
            : userPositions[currentLine] + 1;
        const currentUserInput = userInputs[currentLine] + event.key;

        const targetKey = targetStrings[currentLine].charAt(currentPosition);
        const pressedKey = currentUserInput.charAt(currentPosition);

        accountPressedKeys(targetKey, pressedKey);

        if (targetKey !== pressedKey) {
          setCountOfErrors((prev) => prev + 1);
          setUserErrors((userErrors) => {
            userErrors[currentLine].add(currentPosition);
          });
        }

        setUserPositions((prevPositions) => {
          prevPositions[currentLine] = currentPosition;
        });
        setUserInputs((prevInputs) => {
          prevInputs[currentLine] = currentUserInput;
        });

        function accountPressedKeys(targetKey: string, pressedKey: string) {
          if (targetKey === "") {
            return;
          }
          if (targetKey !== pressedKey) {
            setIncorrectlyPressedKeys((prev) => {
              prev.set(targetKey, (prev.get(targetKey) ?? 0) + 1);
            });
            return;
          }
          setCorrectlyPressedKeys((prev) => {
            prev.set(targetKey, (prev.get(targetKey) ?? 0) + 1);
          });
        }
      }

      function handleEnter() {
        if (currentLine === countOfLines - 1) {
          setStopTimestamp(Date.now());
        }
        setCurrentLine((prev) => prev + 1);
      }
    }

    if (currentLine < countOfLines) {
      document.addEventListener("keydown", handleKeys);
    }
    return () => {
      if (currentLine < countOfLines) {
        document.removeEventListener("keydown", handleKeys);
      }
    };
  }, [userInputs, currentLine, userPositions]);

  return (
    <>
      <main className="flex min-w-[50ch] flex-col gap-4 p-4">
        {lessonPage.description ? (
          <>
            <div className="max-w-[50ch] whitespace-pre-line">
              {lessonPage.description}
            </div>
            <div className="h-0.5 max-w-[50ch] bg-black"></div>
          </>
        ) : null}
        <div>
          {targetStrings.map((targetString, index) => (
            <Line
              isEditable={currentLine === index}
              targetString={targetString}
              key={index}
              userInput={userInputs[index]}
              userErrors={userErrors[index]}
            />
          ))}
        </div>
        {isShowResults ? (
          <>
            <div className="h-0.5 max-w-[50ch] bg-black"></div>
            <Stats
              countOfErrors={countOfErrors}
              onReset={reset}
              start={startTimestamp!}
              stop={stopTimestamp!}
              totalKeypresses={totalKeypresses}
              userInput={userInputs.join("\n")}
              correctlyPressedKeys={correctlyPressedKeys}
              incorrectlyPressedKeys={incorrectlyPressedKeys}
            />
          </>
        ) : null}
      </main>
    </>
  );
}
