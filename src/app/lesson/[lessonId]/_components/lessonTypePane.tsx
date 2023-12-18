import { observer } from "mobx-react-lite";
import Line from "./line";
import { TypePaneStore } from "@/stores/TypePaneStore";

type Props = {
  typePane: TypePaneStore;
};

function LessonTypePane({ typePane }: Props) {
  return (
    <div>
      {typePane.lines.map((line, index) => (
        <Line
          isEditable={typePane.currentLineIndex === index}
          key={index}
          line={line}
        />
      ))}
    </div>
  );
}

export default observer(LessonTypePane);
