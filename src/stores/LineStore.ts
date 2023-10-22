import { makeAutoObservable } from "mobx";

export class LineStore {
  targetText: string;
  input: string;
  cursorIndex: null | number;
  errorIndexes: Set<number>;

  constructor(targetText: string) {
    this.targetText = targetText;
    this.input = "";
    this.cursorIndex = null;
    this.errorIndexes = new Set<number>();
    
    makeAutoObservable(this);
  }

  reset() {
    this.input = "";
    this.cursorIndex = null;
    this.errorIndexes.clear();
  }

  changeInput(value: string) {
    this.input = value;
  }

  addErrorIndex(index: number) {
    this.errorIndexes.add(index);
  }

  deleteErrorIndex(index: number) {
    this.errorIndexes.delete(index);
  }

  changeCursorIndex(value: number | null) {
    this.cursorIndex = value;
  }
}
