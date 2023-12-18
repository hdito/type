import { observer } from "mobx-react-lite";
import { TypePaneStore } from "@/stores/TypePaneStore";

type Props = {
  typePane: TypePaneStore;
};

function Stats({ typePane }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>
          <b>Accuracy:</b> <span>{typePane.accuracy}</span>
        </p>
        <p>
          <b>Raw WPM:</b> <span>{typePane.wpm}</span>
        </p>
        <p>
          <b>Adjusted WPM:</b> <span>{typePane.adjustedWPM}</span>
        </p>
      </div>
      {typePane.leastAccurateKeys.length !== 0 ? (
        <div>
          <h2 className="font-bold">Least accurate keys</h2>
          <ol className="list-inside list-decimal">
            {typePane.leastAccurateKeys.map((key) => (
              <li key={key.key}>
                <span className="inline-block w-[9.6px] text-center">
                  {key.key === " " ? "␣" : key.key}
                </span>
                {" — "}
                <span>{key.accuracy}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

export default observer(Stats);
