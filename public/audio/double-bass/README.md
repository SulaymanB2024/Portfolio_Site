# Double-bass samples

A small real-instrument subset of [VSCO 2 Community Edition](https://versilian-studios.com/vsco-community/), licensed [CC0-1.0](https://raw.githubusercontent.com/sgossner/VSCO-2-CE/440300901dfe9275fd84e0b7763af1f8443ae62e/LICENSE).

Recorded by Sam Gossner & Simon Dalzell; sample cutting by Elan Hickler / Soundemote.

Library musicians; these samples are not performances by Sulayman Bowles.

Original stereo PCM averaged to mono, shortened to at most 3.8s pizzicato / 3.4s arco, leading near-silence trimmed with 4ms preroll, peak normalized to 0.75, 2ms attack / 60ms tail edge fades. Original recorded timbre retained; no synthesized replacement.

Source octave labels differ from standard scientific pitch notation. Native sounding pitches are taken from the author's SFZ MIDI mappings and checked against the recording, then recorded in manifest.json with original / adapted SHA-256 hashes.

Regenerate with `node tools/prepare-about-audio.mjs`. The web player loads the 14 recordings when a music object opens, then plays the nearest sample tuned using its measured native pitch. Sound starts only on a visitor’s gesture.
