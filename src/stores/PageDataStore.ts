import { LessonPage } from "@/schemas/lessonSchema";
import { TypePaneStore } from "./TypePaneStore";
import { makeAutoObservable } from "mobx";

export class PageDataStore {
  description?: string;
  typePane: TypePaneStore | null;

  constructor(page: LessonPage) {
    const { text, description } = page;
    this.description = description;

    if (text === undefined) {
      this.typePane = null;
    } else {
      this.typePane = new TypePaneStore(text);
    }

    makeAutoObservable(this);
  }
}
