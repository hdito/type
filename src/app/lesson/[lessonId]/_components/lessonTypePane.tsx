import { useLessonContext } from "./lessonProvider";
import { Line } from "./line";

export default function LessonTypePane() {
  const { lesson, pageState } = useLessonContext();

  const pageMeta = pageState.pagesMeta[pageState.currentPage]!;
  const pageContent = lesson.pages[pageState.currentPage];

  const targetStrings = pageContent.text!.split("\n");

  return (
    <div>
      {targetStrings.map((targetString, index) => (
        <Line
          isEditable={pageMeta.currentLine === index}
          targetString={targetString}
          key={index}
          userInput={pageMeta.userInputs[index]}
          userErrors={pageMeta.userErrors[index]}
        />
      ))}
    </div>
  );
}
