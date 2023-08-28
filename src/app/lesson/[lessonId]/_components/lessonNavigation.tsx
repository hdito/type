import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useLessonContext } from "./lessonProvider";

type LessonNavigationProps = {
  onAction: () => void;
};

export default function LessonNavigation({ onAction }: LessonNavigationProps) {
  const { dispatch, pageState, lesson } = useLessonContext();
  const router = useRouter();

  const countOfPages = lesson.pages.length;
  const pageMeta = pageState.pagesMeta[pageState.currentPage];

  const exitLesson = useCallback(() => {
    router.push("/");
  }, [router]);
  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, [dispatch]);
  const goToNextPage = useCallback(() => {
    dispatch({ type: "goToNextPage" });
    dispatch({ type: "reset" });
  }, [dispatch]);
  const goToPreviousPage = useCallback(() => {
    dispatch({ type: "goToPreviousPage" });
    dispatch({ type: "reset" });
  }, [dispatch]);

  useEffect(() => {
    document.addEventListener("keydown", handleNavigation);

    function handleNavigation(event: KeyboardEvent): void {
      if (
        !(
          (event.key === "r" && pageMeta !== null) ||
          (event.key === "n" && pageState.currentPage < countOfPages - 1) ||
          (event.key === "p" && pageState.currentPage > 0) ||
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
    countOfPages,
    exitLesson,
    goToNextPage,
    goToPreviousPage,
    pageMeta,
    pageState.currentPage,
    reset,
    onAction,
  ]);

  return (
    <div className="flex gap-4">
      {pageMeta !== null ? (
        <button
          className="self-start rounded-md bg-black px-1 py-0.5 text-white"
          onClick={reset}
        >
          Try again (r)
        </button>
      ) : null}
      {pageState.currentPage > 0 ? (
        <button
          className="self-start rounded-md bg-black px-1 py-0.5 text-white"
          onClick={goToPreviousPage}
        >
          Previous page (p)
        </button>
      ) : null}
      {pageState.currentPage < countOfPages - 1 ? (
        <button
          className="self-start rounded-md bg-black px-1 py-0.5 text-white"
          onClick={goToNextPage}
        >
          Next page (n)
        </button>
      ) : null}
      <button
        className="self-start rounded-md bg-black px-1 py-0.5 text-white"
        onClick={exitLesson}
      >
        Exit lesson (e)
      </button>
    </div>
  );
}
