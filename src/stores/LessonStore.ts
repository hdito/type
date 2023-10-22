import { Lesson } from "@/app/lesson/[lessonId]/_schemas/lessonSchema";
import { makeAutoObservable } from "mobx";

type PageMeta = {
  userInputs: string[];
  userPositions: (number | null)[];
  currentLine: number;
  countOfErrors: number;
  userErrors: Set<number>[];
  correctlyPressedKeys: Map<string, number>;
  incorrectlyPressedKeys: Map<string, number>;
  totalKeypresses: number;
  startTimestamp: number | null;
  stopTimestamp: number | null;
  passedTime: number | null;
};

export class LessonStore {
  currentPage: number;
  pagesMeta: (PageMeta | null)[];
  lesson: Lesson;

  constructor(lesson: Lesson) {
    this.currentPage = 0;
    this.pagesMeta = lesson.pages.map((page) => {
      if (page.description !== undefined && page.text === undefined)
        return null;

      const countOfLines = page.text!.split("\n").length;

      return {
        userInputs: new Array(countOfLines).fill(""),
        userPositions: new Array(countOfLines).fill(null),
        currentLine: 0,
        countOfErrors: 0,
        userErrors: new Array(countOfLines).fill(new Set<number>()),
        correctlyPressedKeys: new Map<string, number>(),
        incorrectlyPressedKeys: new Map<string, number>(),
        totalKeypresses: 0,
        startTimestamp: null,
        stopTimestamp: null,
        passedTime: null,
      };
    });
    this.lesson = lesson;

    makeAutoObservable(this);
  }

  get countOfPages() {
    return this.lesson.pages.length;
  }

  get countOfLines() {
    return this.lesson.pages[this.currentPage].text;
  }

  get content() {
    return this.lesson.pages[this.currentPage];
  }

  get pageMeta() {
    return this.pagesMeta[this.currentPage];
  }

  start() {
    const pageMeta = this.pagesMeta[this.currentPage];
    if (pageMeta === null) return;

    pageMeta.startTimestamp = Date.now();
  }

  goToNextPage() {
    if (this.currentPage === this.countOfPages - 1) {
      return;
    }
    this.currentPage++;
  }

  goToPreviousPage() {
    if (this.currentPage < 1) {
      return;
    }
    this.currentPage--;
  }

  resume() {
    const meta = this.pagesMeta[this.currentPage];
    if (
      meta === null ||
      meta.startTimestamp === null ||
      meta.passedTime === null ||
      meta.stopTimestamp !== null
    ) {
      return;
    }
    meta.startTimestamp = Date.now() - meta.passedTime;
  }

  pause() {
    const meta = this.pagesMeta[this.currentPage];
    if (
      meta === null ||
      meta.startTimestamp === null ||
      meta.stopTimestamp !== null
    ) {
      return;
    }
    meta.passedTime = Date.now() - meta.startTimestamp;
  }

  pressChar(char: string) {
    const meta = this.pagesMeta[this.currentPage];
    if (meta === null) {
      return;
    }

    const prevUserPosition = meta.userPositions[meta.currentLine];
    const currentPosition =
      prevUserPosition === null ? 0 : prevUserPosition + 1;
    const currentUserInput = meta.userInputs[meta.currentLine] + char;

    const targetKey = this.lesson.pages[this.currentPage]
      .text!.split("\n")
      [meta.currentLine].charAt(currentPosition);
    const pressedKey = char;

    this.accountPressedKeys(targetKey, pressedKey, meta);

    if (targetKey !== pressedKey) {
      meta.countOfErrors++;
      meta.userErrors[meta.currentLine].add(currentPosition);
    }

    meta.userPositions[meta.currentLine] = currentPosition;
    meta.userInputs[meta.currentLine] = currentUserInput;
    meta.totalKeypresses++;
  }

  private accountPressedKeys(
    targetKey: string,
    pressedKey: string,
    pageMeta: PageMeta,
  ) {
    if (targetKey === "") {
      return;
    }
    if (targetKey !== pressedKey) {
      pageMeta.incorrectlyPressedKeys.set(
        targetKey,
        (pageMeta.incorrectlyPressedKeys.get(targetKey) ?? 0) + 1,
      );
      return;
    }
    pageMeta.correctlyPressedKeys.set(
      targetKey,
      (pageMeta.correctlyPressedKeys.get(targetKey) ?? 0) + 1,
    );
  }

  pressBackspace() {
    const meta = this.pagesMeta[this.currentPage];

    if (meta === null) {
      return;
    }

    const currentLinePosition = meta.userPositions[meta.currentLine];

    if (
      currentLinePosition !== null &&
      meta.userErrors[meta.currentLine].has(currentLinePosition)
    ) {
      meta.userErrors[meta.currentLine].delete(currentLinePosition);
    }
    const currentPosition =
      currentLinePosition === 0 || currentLinePosition === null
        ? null
        : currentLinePosition - 1;
    const currentUserInput = meta.userInputs[meta.currentLine].slice(0, -1);

    meta.userPositions[meta.currentLine] = currentPosition;
    meta.userInputs[meta.currentLine] = currentUserInput;
  }

  pressEnter() {
    const meta = this.pagesMeta[this.currentPage];
    const targetText = this.lesson.pages[this.currentPage].text;

    if (meta === null || !targetText) {
      return;
    }
    const countOfLines = targetText.split("\n").length;

    if (meta.currentLine === countOfLines - 1) {
      meta.stopTimestamp = Date.now();
    }
    meta.currentLine++;
  }

  reset() {
    if (this.pageMeta === null) {
      return;
    }

    const countOfLines =
      this.lesson.pages[this.currentPage].text!.split("\n").length;

    this.pageMeta.totalKeypresses = 0;
    this.pageMeta.countOfErrors = 0;
    this.pageMeta.currentLine = 0;
    this.pageMeta.startTimestamp = null;
    this.pageMeta.stopTimestamp = null;
    this.pageMeta.correctlyPressedKeys = new Map<string, number>();
    this.pageMeta.incorrectlyPressedKeys = new Map<string, number>();
    this.pageMeta.userInputs = new Array(countOfLines).fill("");
    this.pageMeta.userPositions = new Array(countOfLines).fill(null);
    this.pageMeta.passedTime = null;
  }
}
