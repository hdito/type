import { readdir, readFile } from "fs/promises";
import path from "path";
import yaml from "yaml";
import LessonPage from "./_components/lessonPage";
import LessonProvider from "./_components/lessonProvider";
import { LessonSchema } from "./_schemas/lessonSchema";

export async function generateStaticParams() {
  const lessonIds = await readdir(path.join(process.cwd(), "lessons"));
  return lessonIds.map((lessonId) => {
    lessonId;
  });
}

async function getLesson(name: string) {
  const lessonFile = await readFile(
    path.join(process.cwd(), "lessons", name + ".yml"),
    "utf-8",
  );
  const lesson = yaml.parse(lessonFile);
  const parsedLesson = LessonSchema.parse(lesson);
  return parsedLesson;
}

export default async function LessonFetcher({
  params,
}: {
  params: { lessonId: string };
}) {
  const lesson = await getLesson(params.lessonId);
  return (
    <LessonProvider lesson={lesson}>
      <LessonPage />
    </LessonProvider>
  );
}
