"use client";
import { Lesson } from "@/schemas/lessonSchema";
import { LessonStore } from "@/stores/LessonStore";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type Props = PropsWithChildren<{ lesson: Lesson }>;

const LessonContext = createContext<{
  lessonStore: LessonStore;
} | null>(null);

export const useLessonContext = () => {
  const lessonContext = useContext(LessonContext);
  if (!lessonContext) {
    throw Error(`${useLessonContext.name} must be used within LessonProvider`);
  }
  return lessonContext;
};

export default function LessonProvider({ lesson, children }: Props) {
  const [lessonStore] = useState(new LessonStore(lesson));

  return (
    <LessonContext.Provider
      value={{
        lessonStore,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
}
