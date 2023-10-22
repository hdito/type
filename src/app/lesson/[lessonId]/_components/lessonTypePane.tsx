import { observer } from "mobx-react-lite";
import { useLessonContext } from "./lessonProvider";
import Line from "./line";

function LessonTypePane() {
  const { lessonStore } = useLessonContext();

  const pageMeta = lessonStore.pagesMeta[lessonStore.currentPage]!;
  const targetStrings = lessonStore.content.text!.split("\n");

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

export default observer(LessonTypePane);
