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

  const reset = useCallback(() => {
    lessonStore.reset();
  }, [lessonStore]);

  const goToNextPage = useCallback(() => {
    lessonStore.goToNextPage();
    lessonStore.reset();
  }, [lessonStore]);

  const goToPreviousPage = useCallback(() => {
    lessonStore.goToPreviousPage();
    lessonStore.reset();
  }, [lessonStore]);

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);

    function handleNavigation(event: KeyboardEvent): void {
      if (
        !(
          (event.key === "r" && lessonStore.pageMeta !== null) ||
          (event.key === "n" &&
            lessonStore.currentPage < lessonStore.countOfPages - 1) ||
          (event.key === "p" && lessonStore.currentPage > 0) ||
          event.key === "e"
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
      }
      onAction();
    }

    return () => document.removeEventListener("keydown", handleNavigation);
  }, [
    exitLesson,
    goToNextPage,
    goToPreviousPage,
    lessonStore,
    onAction,
    reset,
  ]);

  const isLastPage = lessonStore.currentPage < lessonStore.countOfPages - 1;
  const hasPreviousPage = lessonStore.currentPage > 0;
  const hasTask = lessonStore.pageMeta !== null;

  return (
    <div className="flex gap-4">
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
