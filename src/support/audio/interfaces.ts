import { Delay } from "../logic/classes";
import { Note } from "./classes";

export interface NoteInterface {
  pitch: number,
  octave: number,
  duration?: Delay
}

export interface SequenceInterface {
  notes: Array<Note>,
}

export interface TextSequenceInterface {
  notes: string;
}