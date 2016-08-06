import Ember from 'ember';

import { Oscillator } from 'ember-audio';
import { MusicalIdentity } from 'ember-audio/mixins';

const MusicallyAwareOscillator = Oscillator.extend(MusicalIdentity);

export default Ember.Controller.extend({
  audio: Ember.inject.service(),
    oscillators: null, // Put oscillators here after they're created

    initSynth: Ember.on('init', function() {
      const audio = this.get('audio');

      // Outputs an array of all the notes on a standard "western" piano
      // Could also do `audio.createNoteArray(notes)` where notes is a POJO,
      // or `audio.load(URL).asNoteArray().then(...)` providing a URL to a JSON file
      // See `utils/frequencyMap` for an example of what these might look like.
      const notes = audio.createNoteArray();

      // Slicing so that the keyboard isn't massive
      const slicedNotes = notes.slice(48, 60);

      // Create a MusicallyAwareOscillator instance for each note in slicedNotes
      const oscillators = slicedNotes.map((note) => {
        return MusicallyAwareOscillator.create({
          type: 'square', // the "shape" of the waveform
          frequency: note.get('frequency'),
          audioContext: audio.get('audioContext')
        });
      });

      this.set('oscillators', oscillators);
    }),

    actions: {
      startNote(note) {
        note.play();
      },

      stopNote(note) {
        if (note.get('isPlaying')) {
          note.stop();
        }
      }
    }
});
