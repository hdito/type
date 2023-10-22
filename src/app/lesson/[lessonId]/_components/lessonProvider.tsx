"use client";
import { LessonStore } from "@/stores/LessonStore";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import type { Lesson } from "../_schemas/lessonSchema";

type LessonProviderProps = PropsWithChildren<{ lesson: Lesson }>;

const LessonContext = createContext<{
  lesson: Lesson;
  lessonStore: LessonStore;
} | null>(null);

export const useLessonContext = () => {
  const lessonContext = useContext(LessonContext);
  if (!lessonContext) {
    throw Error(`${useLessonContext.name} must be used within LessonProvider`);
  }
  return lessonContext;
};

export default function LessonProvider({
  lesson,
  children,
}: LessonProviderProps) {
  const [lessonStore] = useState(new LessonStore(lesson));

  return (
    <LessonContext.Provider
      value={{
        lesson,
        lessonStore,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}
