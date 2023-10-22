import { Lesson } from "@/schemas/lessonSchema";
import { makeAutoObservable } from "mobx";
import { PageDataStore } from "./PageDataStore";

export class LessonStore {
  currentPageIndex: number;
  pagesMeta: (PageDataStore | null)[];

  constructor(lesson: Lesson) {
    this.currentPageIndex = 0;
    this.pagesMeta = lesson.pages.map((page) => new PageDataStore(page));

    makeAutoObservable(this);
  }

  get currentPage() {
    const currentPage = this.pagesMeta[this.currentPageIndex];
    if (!currentPage) throw Error("Invalid page index");

    return currentPage;
  }

  get countOfPages() {
    return this.pagesMeta.length;
  }

  goToNextPage() {
    this.currentPageIndex++;
  }

  goToPreviousPage() {
    this.currentPageIndex--;
  }
}
