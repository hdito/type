import { getAccuracy } from "@/utils/getAccuracy";
import { LineStore } from "./LineStore";
import { getWPM } from "@/utils/getWPM";
import { getAdjustedWPM } from "@/utils/getAdjustedWPM";
import { getLeastAccurateKeys } from "@/utils/getLeastAccurateKeys";
import { makeAutoObservable } from "mobx";

export class TypePaneStore {
  currentLineIndex: number;
  lines: LineStore[];
  countOfKeypresses: number;
  startTimestamp: number | null;
  stopTimestamp: number | null;
  passedTime: number | null;
  countOfErrors: number;
  correctlyPressedKeys: Map<string, number>;
  incorrectlyPressedKeys: Map<string, number>;
  status: "finished" | "typing" | "paused";

  constructor(text: string) {
    this.currentLineIndex = 0;
    this.countOfKeypresses = 0;
    this.startTimestamp = null;
    this.stopTimestamp = null;
    this.passedTime = null;
    this.lines = text.split("\n").map((line) => new LineStore(line));
    this.countOfErrors = 0;
    this.correctlyPressedKeys = new Map<string, number>();
    this.incorrectlyPressedKeys = new Map<string, number>();
    this.status = "typing";

    makeAutoObservable(this);
  }

  get countOfLines() {
    return this.lines.length;
  }

  get currentLine() {
    return this.lines[this.currentLineIndex];
  }

  get targetText() {
    return this.lines.reduce((text, line) => text + "\n" + line.targetText, "");
  }

  get userInputs() {
    return this.lines.reduce((text, line) => text + "\n" + line.input, "");
  }

  get accuracy() {
    return getAccuracy(this.countOfErrors, this.countOfKeypresses);
  }

  get wpm() {
    return getWPM(this.userInputs, this.typingTimeInSec);
  }

  get adjustedWPM() {
    return getAdjustedWPM(
      this.targetText,
      this.userInputs,
      this.typingTimeInSec,
    );
  }

  get leastAccurateKeys() {
    return getLeastAccurateKeys(
      this.correctlyPressedKeys,
      this.incorrectlyPressedKeys,
    );
  }

  get typingTimeInSec() {
    return (this.stopTimestamp! - this.startTimestamp!) / 1000;
  }

  reset() {
    this.lines.forEach((line) => line.reset());
    this.currentLineIndex = 0;
    this.countOfKeypresses = 0;
    this.startTimestamp = null;
    this.stopTimestamp = null;
    this.passedTime = null;
    this.countOfErrors = 0;
    this.status = "typing";
  }

  start() {
    this.startTimestamp = Date.now();
  }

  resume() {
    if (this.passedTime !== null) {
      this.startTimestamp = Date.now() - this.passedTime;
    }
    this.status = "typing";
  }

  pause() {
    if (this.startTimestamp !== null) {
      this.passedTime = Date.now() - this.startTimestamp;
    }
    this.status = "paused";
  }

  pressEnter() {
    if (this.currentLineIndex === this.countOfLines - 1) {
      this.stopTimestamp = Date.now();
      this.status = "finished";
    }
    this.currentLineIndex++;
  }

  pressBackspace() {
    const savedLineIndex = this.currentLine.cursorIndex;

    if (
      savedLineIndex !== null &&
      this.currentLine.errorIndexes.has(savedLineIndex)
    ) {
      this.currentLine.deleteErrorIndex(savedLineIndex);
    }

    const currentIndex =
      savedLineIndex === 0 || savedLineIndex === null
        ? null
        : savedLineIndex - 1;

    this.currentLine.changeCursorIndex(currentIndex);
    this.currentLine.changeInput(this.currentLine.input.slice(0, -1));
  }

  pressChar(char: string) {
    const prevCursorIndex = this.currentLine.cursorIndex;
    const currentIndex = prevCursorIndex === null ? 0 : prevCursorIndex + 1;
    const currentUserInput = this.currentLine.input + char;

    const targetKey = this.currentLine.targetText.charAt(currentIndex);
    const pressedKey = char;

    this.accountPressedKeys(targetKey, pressedKey);

    if (targetKey !== pressedKey) {
      this.countOfErrors++;
      this.currentLine.addErrorIndex(currentIndex);
    }

    this.currentLine.changeCursorIndex(currentIndex);
    this.currentLine.changeInput(currentUserInput);

    this.countOfKeypresses++;
  }

  private accountPressedKeys(targetKey: string, pressedKey: string) {
    if (targetKey === "") {
      return;
    }
    if (targetKey !== pressedKey) {
      this.incorrectlyPressedKeys.set(
        targetKey,
        (this.incorrectlyPressedKeys.get(targetKey) ?? 0) + 1,
      );
      return;
    }
    this.correctlyPressedKeys.set(
      targetKey,
      (this.correctlyPressedKeys.get(targetKey) ?? 0) + 1,
    );
  }
}
