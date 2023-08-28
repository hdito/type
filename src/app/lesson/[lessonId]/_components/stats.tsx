import { getAccuracy } from "./_statsUtils/getAccuracy";
import { getAdjustedWPM } from "./_statsUtils/getAdjustedWPM";
import { getLeastAccurateKeys } from "./_statsUtils/getLeastAccurateKeys";
import { getWPM } from "./_statsUtils/getWPM";
import { useLessonContext } from "./lessonProvider";

export function Stats() {
  const { lesson, pageState } = useLessonContext();

  const pageMeta = pageState.pagesMeta[pageState.currentPage];
  const pageContent = lesson.pages[pageState.currentPage];

  if (
    pageMeta === null ||
    !pageContent.text ||
    pageMeta.stopTimestamp === null ||
    pageMeta.startTimestamp === null
  ) {
    throw Error("Must be used only after finishing pages with typing");
  }

  const targetText = pageContent.text;
  const userInput = pageMeta.userInputs.join("\n");
  const passedTime = (pageMeta.stopTimestamp - pageMeta.startTimestamp) / 1000;

  const wpm = getWPM(userInput, passedTime);
  const adjustedWPM = getAdjustedWPM(targetText, userInput, passedTime);
  const accuracy = getAccuracy(
    pageMeta.countOfErrors,
    pageMeta.totalKeypresses,
  );
  const leastAccurateKeys = getLeastAccurateKeys(
    pageMeta.correctlyPressedKeys,
    pageMeta.incorrectlyPressedKeys,
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>
          <b>Accuracy:</b> <span>{accuracy}</span>
        </p>
        <p>
          <b>Raw WPM:</b> <span>{wpm}</span>
        </p>
        <p>
          <b>Adjusted WPM:</b> <span>{adjustedWPM}</span>
        </p>
      </div>
      {leastAccurateKeys.length !== 0 ? (
        <div>
          <h2 className="font-bold">Least accurate keys</h2>
          <ol className="list-inside list-decimal">
            {leastAccurateKeys.map((key) => (
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
