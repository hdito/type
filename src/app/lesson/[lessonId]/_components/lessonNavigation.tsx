import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useLessonContext } from "./lessonProvider";
import Button from "@/components/Button";
import { observer } from "mobx-react-lite";

type LessonNavigationProps = {
  onAction: () => void;
};

function LessonNavigation({ onAction }: LessonNavigationProps) {
  const { lessonStore } = useLessonContext();
  const router = useRouter();

  const exitLesson = useCallback(() => {
    router.push("/");
  }, [router]);

  const reset = useCallback(
    () => lessonStore.currentPage?.typePane?.reset(),
    [lessonStore.currentPage?.typePane],
  );

  const goToNextPage = useCallback(() => {
    lessonStore.goToNextPage();
    lessonStore.currentPage?.typePane?.reset();
  }, [lessonStore]);

  const goToPreviousPage = useCallback(() => {
    lessonStore.goToPreviousPage();
    lessonStore.currentPage?.typePane?.reset();
  }, [lessonStore]);

  const resume = useCallback(() => {
    lessonStore.currentPage.typePane?.resume();
  }, [lessonStore]);

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);

    function handleNavigation(event: KeyboardEvent): void {
      if (
        !(
          (event.key === "r" && lessonStore.currentPage?.typePane !== null) ||
          (event.key === "n" &&
            lessonStore.currentPageIndex < lessonStore.countOfPages - 1) ||
          (event.key === "p" && lessonStore.currentPageIndex > 0) ||
          event.key === "e" ||
          (event.key === "Escape" &&
            lessonStore.currentPage.typePane?.status === "paused")
        )
      ) {
        return;
      }

      switch (event.key) {
        case "r":
          reset();
          break;
        case "n":
          goToNextPage();
          break;
        case "e":
          exitLesson();
          break;
        case "p":
          goToPreviousPage();
          break;
        case "Escape":
          resume();
          break;
      }
      onAction();
    }

    return () => document.removeEventListener("keydown", handleNavigation);
  }, [
    exitLesson,
    goToNextPage,
    goToPreviousPage,
    lessonStore.countOfPages,
    lessonStore.currentPage?.typePane,
    lessonStore.currentPageIndex,
    onAction,
    reset,
  ]);

  const isLastPage =
    lessonStore.currentPageIndex < lessonStore.countOfPages - 1;
  const hasPreviousPage = lessonStore.currentPageIndex > 0;
  const hasTask = lessonStore.currentPage.typePane !== null;
  const isPaused = lessonStore.currentPage.typePane?.status === "paused";

  return (
    <div className="flex gap-4">
      {isPaused ? <Button onClick={resume}>Resume (Esc)</Button> : null}
      {hasTask ? <Button onClick={reset}>Try again (r)</Button> : null}
      {hasPreviousPage ? (
        <Button onClick={goToPreviousPage}>Previous page (p)</Button>
      ) : null}
      {isLastPage ? (
        <Button onClick={goToNextPage}>Next page (n)</Button>
      ) : null}
      <Button onClick={exitLesson}>Exit lesson (e)</Button>
    </div>
  );
}

export default observer(LessonNavigation);
