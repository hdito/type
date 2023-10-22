"use client";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect } from "react";
import LessonNavigation from "./lessonNavigation";
import { useLessonContext } from "./lessonProvider";
import LessonTypePane from "./lessonTypePane";
import Stats from "./stats";

function LessonPage() {
  const { lessonStore } = useLessonContext();

  const typePane = lessonStore.currentPage.typePane;

  const isShowNavigation =
    typePane === null ||
    typePane.status === "finished" ||
    typePane.status === "paused";

  const handleAction = useCallback(() => {
    typePane?.resume();
  }, [typePane]);

  useEffect(() => {
    if (typePane === null || typePane.status !== "typing") {
      return;
    }

    function handleKeys(event: KeyboardEvent) {
      if (typePane === null) return;
      if (
        !(
          event.key === "Backspace" ||
          event.key === "Enter" ||
          event.key.length === 1
        )
      ) {
        return;
      }

      if (typePane.startTimestamp === null) {
        typePane.start();
      }

      switch (event.key) {
        case "Backspace":
          typePane.pressBackspace();
          break;
        case "Enter":
          typePane.pressEnter();
          break;
        default:
          typePane.pressChar(event.key);
          break;
      }
    }

    const countOfLines = typePane.countOfLines;
    const currentLine = typePane.currentLineIndex;

    if (currentLine < countOfLines!) {
      document.addEventListener("keydown", handleKeys);
    }

    return () => {
      if (currentLine < countOfLines) {
        document.removeEventListener("keydown", handleKeys);
      }
    };
  }, [isShowNavigation, typePane, typePane?.status]);

  useEffect(() => {
    function handleNavigation(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      if (typePane?.status === "paused") {
        typePane.resume();
        return;
      }

      if (typePane?.status === "typing") {
        typePane.pause();
        return;
      }
    }

    document.addEventListener("keydown", handleNavigation);
    return () => document.removeEventListener("keydown", handleNavigation);
  }, [typePane, typePane?.status]);

  return (
    <>
      <main className="flex min-w-[50ch] flex-col gap-4 p-4">
        <div className="max-w-[50ch] whitespace-pre-line">
          <span>
            ({lessonStore.currentPageIndex + 1}/{lessonStore.countOfPages})
          </span>
          {lessonStore.currentPage.description ? (
            <>{lessonStore.currentPage.description}</>
          ) : null}
        </div>
        {typePane !== null ? <LessonTypePane typePane={typePane} /> : null}
        {typePane?.status === "finished" ? <Stats typePane={typePane} /> : null}
        {isShowNavigation ? <LessonNavigation onAction={handleAction} /> : null}
      </main>
    </>
  );
}

export default observer(LessonPage);
