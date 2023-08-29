import { readdir } from "fs/promises";
import path from "path";
import Lessons from "./lessons";

async function getLessonNames() {
  const lessonNames = await readdir(path.join(process.cwd(), "lessons"));
  const lessonNamesWithoutExtension = lessonNames.map((name) =>
    path.basename(name, ".yml"),
  );
  return lessonNamesWithoutExtension;
}

export default async function LessonsFetcher() {
  const lessonNames = await getLessonNames();
  return (
    <>
      <header className="flex flex-col gap-2 p-4">
        <h1 className="text-xl font-bold">Type</h1>
        <p>
          <b className="font-black">The</b> tutor for touch typing practice
        </p>
      </header>
      <main className="p-4">
        {lessonNames.length !== 0 ? (
          <>
            <h2 className="text-lg font-bold">Lessons</h2>
            <Lessons lessonNames={lessonNames} />
          </>
        ) : null}
      </main>
    </>
  );
}
