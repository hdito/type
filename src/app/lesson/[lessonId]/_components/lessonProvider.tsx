"use client";
import { Dispatch, PropsWithChildren, createContext, useContext } from "react";
import { useImmerReducer } from "use-immer";
import type { Lesson } from "../_schemas/lessonSchema";

type LessonProviderProps = PropsWithChildren<{ lesson: Lesson }>;

type Action =
  | { type: "goToNextPage" }
  | { type: "goToPreviousPage" }
  | { type: "reset" }
  | { type: "start" }
  | { type: "pressBackspace" }
  | { type: "pressEnter" }
  | { type: "pressChar"; payload: string };

type State = {
  currentPage: number;
  pagesMeta: ({
    userInputs: any[];
    userPositions: any[];
    currentLine: number;
    countOfErrors: number;
    userErrors: any[];
    correctlyPressedKeys: Map<string, number>;
    incorrectlyPressedKeys: Map<string, number>;
    totalKeypresses: number;
    startTimestamp: number | null;
    stopTimestamp: number | null;
  } | null)[];
};

const LessonContext = createContext<{
  lesson: Lesson;
  dispatch: Dispatch<Action>;
  pageState: State;
} | null>(null);

export const useLessonContext = () => {
  const pagesContext = useContext(LessonContext);
  if (!pagesContext) {
    throw Error(`${useLessonContext.name} must be used within LessonProvider`);
  }
  return pagesContext;
};

export default function LessonProvider({
  lesson,
  children,
}: LessonProviderProps) {
  const [pageState, dispatch] = useImmerReducer<State, Action>(
    (draft, action) => {
      switch (action.type) {
        case "start": {
          const pageMeta = draft.pagesMeta[draft.currentPage];
          if (pageMeta === null) break;
          pageMeta.startTimestamp = Date.now();
          break;
        }
        case "goToNextPage": {
          draft.currentPage++;
          break;
        }
        case "goToPreviousPage": {
          if (draft.currentPage < 1) break;
          draft.currentPage--;
          break;
        }
        case "reset": {
          const meta = draft.pagesMeta[draft.currentPage];

          if (meta === null) {
            break;
          }

          const countOfLines =
            lesson.pages[draft.currentPage].text!.split("\n").length;

          meta.totalKeypresses = 0;
          meta.countOfErrors = 0;
          meta.currentLine = 0;
          meta.startTimestamp = null;
          meta.stopTimestamp = null;
          meta.correctlyPressedKeys = new Map<string, number>();
          meta.incorrectlyPressedKeys = new Map<string, number>();
          meta.userInputs = new Array(countOfLines).fill("");
          meta.userPositions = new Array(countOfLines).fill(null);
          break;
        }
        case "pressEnter": {
          const meta = draft.pagesMeta[draft.currentPage];
          const targetText = lesson.pages[draft.currentPage].text;

          if (meta === null || !targetText) {
            break;
          }
          const countOfLines = targetText.split("\n").length;

          if (meta.currentLine === countOfLines - 1) {
            meta.stopTimestamp = Date.now();
          }
          meta.currentLine++;
          break;
        }
        case "pressChar": {
          const meta = draft.pagesMeta[draft.currentPage]!;

          if (meta === null) {
            break;
          }

          const currentPosition =
            meta.userPositions[meta.currentLine] === null
              ? 0
              : meta.userPositions[meta.currentLine] + 1;
          const currentUserInput =
            meta.userInputs[meta.currentLine] + action.payload;

          const targetKey = lesson.pages[draft.currentPage]
            .text!.split("\n")
            [meta.currentLine].charAt(currentPosition);
          const pressedKey = action.payload;

          accountPressedKeys(targetKey, pressedKey);

          if (targetKey !== pressedKey) {
            meta.countOfErrors++;
            meta.userErrors[meta.currentLine].add(currentPosition);
          }

          meta.userPositions[meta.currentLine] = currentPosition;
          meta.userInputs[meta.currentLine] = currentUserInput;
          meta.totalKeypresses++;

          function accountPressedKeys(targetKey: string, pressedKey: string) {
            if (targetKey === "") {
              return;
            }
            if (targetKey !== pressedKey) {
              meta.incorrectlyPressedKeys.set(
                targetKey,
                (meta.incorrectlyPressedKeys.get(targetKey) ?? 0) + 1,
              );
              return;
            }
            meta.correctlyPressedKeys.set(
              targetKey,
              (meta.correctlyPressedKeys.get(targetKey) ?? 0) + 1,
            );
          }
          break;
        }
        case "pressBackspace": {
          const meta = draft.pagesMeta[draft.currentPage];

          if (meta === null) {
            break;
          }

          if (
            meta.userPositions[meta.currentLine] !== null &&
            meta.userErrors[meta.currentLine].has(
              meta.userPositions[meta.currentLine],
            )
          ) {
            meta.userErrors[meta.currentLine].delete(
              meta.userPositions[meta.currentLine],
            );
          }
          const currentPosition =
            meta.userPositions[meta.currentLine] === 0 ||
            meta.userPositions[meta.currentLine] === null
              ? null
              : meta.userPositions[meta.currentLine] - 1;
          const currentUserInput = meta.userInputs[meta.currentLine].slice(
            0,
            -1,
          );

          meta.userPositions[meta.currentLine] = currentPosition;
          meta.userInputs[meta.currentLine] = currentUserInput;
          break;
        }
      }
    },
    {
      currentPage: 0,
      pagesMeta: lesson.pages.map((page) => {
        if (page.description !== undefined && page.text === undefined)
          return null;

        const countOfLines = page.text!.split("\n").length;

        return {
          userInputs: new Array(countOfLines).fill(""),
          userPositions: new Array(countOfLines).fill(null),
          currentLine: 0,
          countOfErrors: 0,
          userErrors: new Array(countOfLines).fill(new Set<number>()),
          correctlyPressedKeys: new Map<string, number>(),
          incorrectlyPressedKeys: new Map<string, number>(),
          totalKeypresses: 0,
          startTimestamp: null,
          stopTimestamp: null,
        };
      }),
    },
  );

  return (
    <LessonContext.Provider
      value={{
        lesson,
        dispatch,
        pageState,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}
