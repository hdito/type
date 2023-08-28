import { readdir } from "fs/promises";
import Link from "next/link";
import path from "path";

async function getLessonNames() {
  const lessonNames = await readdir(path.join(process.cwd(), "lessons"));
  const lessonNamesWithoutExtension = lessonNames.map((name) =>
    path.basename(name, ".yml"),
  );
  return lessonNamesWithoutExtension;
}

export default async function Home() {
  const lessonNames = await getLessonNames();
  return (
    <>
      <header className="flex flex-col gap-2 p-4">
        <h1 className="text-xl font-bold">Type</h1>
        <p>Welcome to touch typing tutor</p>
      </header>
      <main className="p-4">
        <h2 className="text-lg font-bold">Lessons</h2>
        <ol className="list-inside list-decimal">
          {lessonNames.map((name) => (
            <li key={name}>
              <Link
                href={`lesson/${name}`}
                className=" hover:bg-black hover:text-white focus:bg-black focus:text-white"
              >
                {name}
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
