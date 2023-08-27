"use client";
import LessonPage from "./lessonPage";
import { useLessonContext } from "./lessonProvider";

export default function LessonPageRerenderer() {
  const { currentPage } = useLessonContext();
  return <LessonPage key={currentPage} />;
}
