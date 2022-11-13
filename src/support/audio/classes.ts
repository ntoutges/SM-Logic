import { Delay } from "../logic/classes";
import { Time } from "../logic/enums";
import { Equatable } from "../support/classes";
import { UniPitch } from "./enums";
import { NoteInterface, SequenceInterface, TextSequenceInterface } from "./interfaces";

export class Note extends Equatable {
  readonly pitch: number;
  readonly octave: number;
  readonly duration: Delay;
  constructor({
    pitch,
    octave,
    duration = new Delay({delay: 1, unit: Time.Tick})
  }: NoteInterface) {
    super(["pitch", "octave", "duration"])
    this.pitch = pitch;
    this.octave = octave;
    this.duration = duration;
  }
}

export class Sequence extends Equatable {
  readonly notes: Array<Note>;
  constructor({
    notes,
  }: SequenceInterface) {
    super(["notes"]);
    this.notes = notes;
  }
}

export class TextSequence extends Sequence {
  constructor({
    notes // format of (<setup>)a---bcd-e(<setup>)a-b---cd-ef-a...
  }: TextSequenceInterface) {
    const noteSequence: Array<Note> = [];
    
    let inSettings = -1;
    let octave = 4;
    let timing = 1;
    let delay: Delay = new Delay({ delay:1, unit:Time.Tick });
    for (let i = 0; i < notes.length; i++) {
      if (notes[i] == "(") {
        inSettings = i+1;
        continue;
      }
      else if (notes[i] == ")") {
        inSettings = -1;
        delay = new Delay({ delay:timing, unit: Time.Tick })
        continue;
      }
      
      if (inSettings == -1) { // in sound portion of string
        noteSequence.push(
          new Note({
            pitch: UniPitch[notes[i]],
            octave: octave,
            duration: delay
          })
        );
      }
      else {
        if (i - inSettings == 0) // octave
          octave = parseInt(notes[i]);
        else if (i - inSettings == 1) // timing
          timing = parseInt(notes[i], 16);
        else if (i - inSettings == 2) // also timing
          timing += parseInt(notes[i], 16) * Math.pow(2, i-inSettings - 1);
      }
    }
    super({notes: noteSequence});
  }
}