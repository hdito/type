"use client";
import { enableMapSet } from "immer";
import { useEffect, useMemo } from "react";
import { useLessonContext } from "./lessonProvider";
import LessonTypePane from "./lessonTypePane";
import { Stats } from "./stats";
import LessonNavigation from "./lessonNavigation";

enableMapSet();

export default function LessonPage() {
  const { lesson, dispatch, pageState } = useLessonContext();

  const pageMeta = useMemo(
    () => pageState.pagesMeta[pageState.currentPage],
    [pageState],
  );
  const pageContent = useMemo(
    () => lesson.pages[pageState.currentPage],
    [lesson, pageState.currentPage],
  );

  const isShowResults =
    pageMeta !== null &&
    pageContent.text?.split("\n").length === pageMeta.currentLine;
  const isShowNavigation =
    pageMeta === null ||
    pageMeta.currentLine === pageContent.text?.split("\n").length;

  useEffect(() => {
    if (pageMeta === null) {
      return;
    }

    function handleKeys(event: KeyboardEvent): void {
      if (
        !(
          event.key === "Backspace" ||
          event.key === "Enter" ||
          event.key.length === 1
        )
      ) {
        return;
      }

      if (pageMeta!.startTimestamp === null) {
        dispatch({ type: "setStartTimestamp" });
      }

      switch (event.key) {
        case "Backspace":
          dispatch({ type: "pressBackspace" });
          break;
        case "Enter":
          dispatch({ type: "pressEnter" });
          break;
        default:
          dispatch({ type: "pressChar", payload: event.key });
          break;
      }
    }

    const countOfLines = pageContent.text!.split("\n").length;
    const currentLine = pageMeta.currentLine;

    if (currentLine < countOfLines) {
      document.addEventListener("keydown", handleKeys);
    }

    return () => {
      if (currentLine < countOfLines) {
        document.removeEventListener("keydown", handleKeys);
      }
    };
  }, [dispatch, pageContent, pageMeta]);

  return (
    <>
      <main className="flex min-w-[50ch] flex-col gap-4 p-4">
        {pageContent.description ? (
          <div className="max-w-[50ch] whitespace-pre-line">
            {pageContent.description}
          </div>
        ) : null}
        {pageMeta !== null ? <LessonTypePane /> : null}
        {isShowResults ? <Stats /> : null}
        {isShowNavigation ? <LessonNavigation /> : null}
      </main>
    </>
  );
}
