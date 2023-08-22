"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const targetString = "home home home home home";
  const renderBlocks = targetString.split("");
  const [userInput, setUserInput] = useState("");
  const renderUserInput = userInput.split("");
  const userErrors = useRef(new Set<number>());
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [mode, setMode] = useState<"type" | "result">("type");
  const [countOfErrors, setCountOfErrors] = useState(0);

  function reset() {
    setUserInput("");
    setUserPosition(null);
    setMode("type");
    setCountOfErrors(0);
    userErrors.current.clear();
  }

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
        if (userPosition !== null && userErrors.current.has(userPosition)) {
          userErrors.current.delete(userPosition);
        }
        const currentPosition =
          userPosition === 0 || userPosition === null ? null : userPosition - 1;
        const currentUserInput = userInput.slice(0, -1);
        setUserPosition(currentPosition);
        setUserInput(currentUserInput);
      }

      function handleChar() {
        const currentPosition = userPosition === null ? 0 : userPosition + 1;
        const currentUserInput = userInput + event.key;
        if (
          targetString.charAt(currentPosition) !==
          currentUserInput.charAt(currentPosition)
        ) {
          setCountOfErrors((prev) => prev + 1);
          userErrors.current.add(currentPosition);
        }
        setUserPosition(currentPosition);
        setUserInput(currentUserInput);
      }

      function handleEnter() {
        setMode("result");
      }
    }

    if (mode === "type") {
      document.addEventListener("keydown", handleKeys);
    }
    return () => {
      if (mode === "type") {
        document.removeEventListener("keydown", handleKeys);
      }
    };
  }, [userPosition, userInput, mode]);
  return (
    <>
      <main className="p-4">
        <div>
          {renderBlocks.map((char, index) => (
            <span key={index}>{char}</span>
          ))}
        </div>
        <div>
          {renderUserInput.map((char, index) => (
            <span
              className={
                userErrors.current.has(index) ? "underline decoration-2" : ""
              }
              key={index}
            >
              {char}
            </span>
          ))}
          {mode === "type" ? <span>_</span> : null}
        </div>
        {mode === "result" ? (
          <>
            <p>
              <b>Errors:</b> <span>{countOfErrors}</span>
            </p>
            <button onClick={reset}>Reset</button>
          </>
        ) : null}
      </main>
    </>
  );
}
