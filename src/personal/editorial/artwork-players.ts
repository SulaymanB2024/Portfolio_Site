import type { ArtworkPlayer } from './artwork-player'
import { createArtworkHandoffs } from './artwork-handoff.ts'

/** Routing can lend live players without eagerly loading their renderer runtime. */
export const artworkPlayers = createArtworkHandoffs<HTMLElement, ArtworkPlayer>()
if (import.meta.hot) import.meta.hot.dispose(() => artworkPlayers.dispose())
