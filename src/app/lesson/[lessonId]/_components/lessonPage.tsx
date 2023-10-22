"use client";
import { observer } from "mobx-react-lite";
import { useCallback, useEffect, useState } from "react";
import LessonNavigation from "./lessonNavigation";
import { useLessonContext } from "./lessonProvider";
import LessonTypePane from "./lessonTypePane";
import Stats from "./stats";

function LessonPage() {
  const { lesson, lessonStore } = useLessonContext();
  const [isOpenNavigationWithKeyboard, setIsOpenNavigationWithKeyboard] =
    useState(false);

  const countOfPages = lesson.pages.length;

  const isShowResults =
    lessonStore.pageMeta !== null &&
    lessonStore.content.text?.split("\n").length ===
      lessonStore.pageMeta.currentLine;
  const isShowNavigation =
    lessonStore.pageMeta === null ||
    lessonStore.pageMeta.currentLine ===
      lessonStore.content.text?.split("\n").length;

  const handleAction = useCallback(() => {
    lessonStore.resume();
    setIsOpenNavigationWithKeyboard(false);
  }, [lessonStore]);

  useEffect(() => {
    if (isShowNavigation) {
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

      if (lessonStore.pageMeta!.startTimestamp === null) {
        lessonStore.start();
      }

      switch (event.key) {
        case "Backspace":
          lessonStore.pressBackspace();
          break;
        case "Enter":
          lessonStore.pressEnter();
          break;
        default:
          lessonStore.pressChar(event.key);
          break;
      }
    }

    const countOfLines = lessonStore.content.text!.split("\n").length;
    const currentLine = lessonStore.pageMeta!.currentLine;

    if (currentLine < countOfLines!) {
      document.addEventListener("keydown", handleKeys);
    }

    return () => {
      if (currentLine < countOfLines) {
        document.removeEventListener("keydown", handleKeys);
      }
    };
  }, [lessonStore, isOpenNavigationWithKeyboard, isShowNavigation]);

  useEffect(() => {
    function handleNavigation(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      if (isOpenNavigationWithKeyboard) {
        lessonStore.resume();
      } else {
        lessonStore.pause();
      }
      setIsOpenNavigationWithKeyboard((prev) => !prev);
    }

    document.addEventListener("keydown", handleNavigation);
    return () => document.removeEventListener("keydown", handleNavigation);
  }, [isOpenNavigationWithKeyboard, lessonStore]);

  return (
    <>
      <main className="flex min-w-[50ch] flex-col gap-4 p-4">
        <div className="max-w-[50ch] whitespace-pre-line">
          <span>
            ({lessonStore.currentPage + 1}/{countOfPages})
          </span>
          {lessonStore.content.description ? (
            <>{lessonStore.content.description}</>
          ) : null}
        </div>
        {lessonStore.pageMeta !== null ? <LessonTypePane /> : null}
        {isShowResults ? <Stats /> : null}
        {isShowNavigation || isOpenNavigationWithKeyboard ? (
          <LessonNavigation onAction={handleAction} />
        ) : null}
      </main>
    </>
  );
}

export default observer(LessonPage);
