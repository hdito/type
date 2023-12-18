import { observer } from "mobx-react-lite";
import { LineStore } from "@/stores/LineStore";

type LineProps = {
  isEditable: boolean;
  line: LineStore;
};

function Line({ line, isEditable }: LineProps) {
  return (
    <>
      <div className="flex h-6">
        {line.targetText.split("").map((char, index) => (
          <span className="inline-block w-[9.6px] text-center" key={index}>
            {char}
          </span>
        ))}
      </div>
      <div className="flex h-6">
        {line.input.split("").map((char, index) => (
          <span
            className={`inline-block w-[9.6px] text-center ${
              line.errorIndexes.has(index) ? "bg-black text-white" : ""
            }`}
            key={index}
          >
            {char}
          </span>
        ))}
        {isEditable ? <span>_</span> : null}
      </div>
    </>
  );
}

export default observer(Line);
