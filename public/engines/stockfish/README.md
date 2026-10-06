# Stockfish.js 19.0.0

The chess opponent uses the full NNUE single-threaded WebAssembly edition of
[Stockfish.js](https://github.com/nmrugg/stockfish.js), distributed unchanged from
the official `stockfish@19.0.0` npm package. It was released on September 15, 2026.

- [GNU GPL version 3](./Copying.txt)
- [Authors](./AUTHORS)
- [Source code, build scripts and exact NNUE network](./source/stockfish-19.0.0-source.zip)
- [Asset provenance and SHA-256 hashes](./provenance.json)
- [Upstream README](./README.upstream.md)
- [NNUE network CC0 license](./LICENSE-NETWORK-CC0.txt)

The source ZIP contains the complete upstream source tree at npm's recorded
Git commit `54fde71d90c7c403964f6cacef48f7bbec495df1` and the exact embedded network,
`nn-1a298aa575a0.nnue`, plus build notes and network licensing materials. Upstream
release tag `v19.0.0` has the identical source tree. No engine code was modified.

Only `stockfish-19-single.js` and `stockfish-19-single.wasm` are loaded to play.
The separate source archive is downloaded only on request.

Stockfish.js (c) 2026 Chess.com, LLC. Stockfish is derived from Glaurung 2.1 and
Copyright (c) 2004–2026 The Stockfish developers. Stockfish is distributed under
the GNU General Public License, version 3 or later, without any warranty.
