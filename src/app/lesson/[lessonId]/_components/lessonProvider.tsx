"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { Lesson } from "../_schemas/lessonSchema";

const LessonContext = createContext<{
  currentPage: number;
  countOfPages: number;
  lesson: Lesson;
  onNextPage: () => void;
} | null>(null);

export const useLessonContext = () => {
  const pagesContext = useContext(LessonContext);
  if (!pagesContext) {
    throw Error(`${useLessonContext.name} must be used within LessonProvider`);
  }
  return pagesContext;
};

type LessonProviderProps = PropsWithChildren<{ lesson: Lesson }>;

export default function LessonProvider({
  lesson,
  children,
}: LessonProviderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const countOfPages = lesson.pages.length;
  const onNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  return (
    <LessonContext.Provider
      value={{
        currentPage,
        countOfPages,
        onNextPage,
        lesson,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}
