export type TravelingArtwork<Host> = {
  moveTo(host: Host): void
  setTravel(traveling: boolean): void
  dispose(): void
}

type Placement<Player, Host> = { player: Player; owner?: object; host?: Host; flight?: object }

/** Only a current flight may outlive its route; ordinary placements dispose on unmount. */
export function createArtworkHandoffs<Host, Player extends TravelingArtwork<Host>>() {
  const placements = new Map<string, Placement<Player, Host>>()
  return {
    acquire(key: string | undefined, owner: object, host: Host, create: () => Player): Player {
      const retained = key ? placements.get(key) : undefined
      const placement: Placement<Player, Host> = retained?.flight ? retained : { player: create() }
      placement.owner = owner
      placement.host = host
      if (key) placements.set(key, placement)
      if (!placement.flight) placement.player.moveTo(host)
      return placement.player
    },
    release(key: string | undefined, owner: object, player: Player) {
      const placement = key ? placements.get(key) : undefined
      if (!placement || placement.player !== player) { player.dispose(); return }
      if (placement.owner !== owner) return
      placement.owner = placement.host = undefined
      if (!placement.flight) { placements.delete(key!); player.dispose() }
    },
    get(key: string) { return placements.get(key)?.player },
    traveling(key: string | undefined) { return Boolean(key && placements.get(key)?.flight) },
    lift(key: string) {
      const placement = placements.get(key)
      if (!placement) return
      const token = {}
      placement.flight = token
      placement.player.setTravel(true)
      return {
        player: placement.player,
        finish() {
          // An older completion cannot attach or dispose a newer journey's drawing.
          if (placement.flight !== token) return
          placement.flight = undefined
          placement.player.setTravel(false)
          if (placement.owner && placement.host) placement.player.moveTo(placement.host)
          else { if (placements.get(key) === placement) placements.delete(key); placement.player.dispose() }
        },
      }
    },
    dispose() { placements.forEach(({ player }) => player.dispose()); placements.clear() },
  }
}
