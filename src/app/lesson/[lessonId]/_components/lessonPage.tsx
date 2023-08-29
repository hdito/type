"use client";
import { enableMapSet } from "immer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLessonContext } from "./lessonProvider";
import LessonTypePane from "./lessonTypePane";
import { Stats } from "./stats";
import LessonNavigation from "./lessonNavigation";

enableMapSet();

export default function LessonPage() {
  const { lesson, dispatch, lessonState } = useLessonContext();
  const [isOpenNavigationWithKeyboard, setIsOpenNavigationWithKeyboard] =
    useState(false);

  const countOfPages = lesson.pages.length;

  const pageMeta = useMemo(
    () => lessonState.pagesMeta[lessonState.currentPage],
    [lessonState],
  );
  const pageContent = useMemo(
    () => lesson.pages[lessonState.currentPage],
    [lesson, lessonState.currentPage],
  );

  const isShowResults =
    pageMeta !== null &&
    pageContent.text?.split("\n").length === pageMeta.currentLine;
  const isShowNavigation =
    pageMeta === null ||
    pageMeta.currentLine === pageContent.text?.split("\n").length;

  const handleAction = useCallback(() => {
    dispatch({ type: "resume" });
    setIsOpenNavigationWithKeyboard(false);
  }, [dispatch]);

  useEffect(() => {
    if (pageMeta === null || isOpenNavigationWithKeyboard) {
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
        dispatch({ type: "start" });
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
    const currentLine = pageMeta!.currentLine;

    if (currentLine < countOfLines) {
      document.addEventListener("keydown", handleKeys);
    }

    return () => {
      if (currentLine < countOfLines) {
        document.removeEventListener("keydown", handleKeys);
      }
    };
  }, [dispatch, pageContent, pageMeta, isOpenNavigationWithKeyboard]);

  useEffect(() => {
    function handleNavigation(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }
      if (isOpenNavigationWithKeyboard) {
        dispatch({ type: "resume" });
      } else {
        dispatch({ type: "pause" });
      }
      setIsOpenNavigationWithKeyboard((prev) => !prev);
    }

    document.addEventListener("keydown", handleNavigation);
    return () => document.removeEventListener("keydown", handleNavigation);
  }, [dispatch, isOpenNavigationWithKeyboard]);

  return (
    <>
      <main className="flex min-w-[50ch] flex-col gap-4 p-4">
        <div className="max-w-[50ch] whitespace-pre-line">
          <span>
            ({lessonState.currentPage + 1}/{countOfPages})
          </span>
          {pageContent.description ? <> {pageContent.description}</> : null}
        </div>
        {pageMeta !== null ? <LessonTypePane /> : null}
        {isShowResults ? <Stats /> : null}
        {isShowNavigation || isOpenNavigationWithKeyboard ? (
          <LessonNavigation onAction={handleAction} />
        ) : null}
      </main>
    </>
  );
}
