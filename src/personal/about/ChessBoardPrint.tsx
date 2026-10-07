import ChessPrintScreen from './chess-print-screen'

/** Physical ivory and graphite stay the same when the surrounding page changes theme. */
export default function ChessBoardPrint({ scope }: { scope: string }) {
  return <>
    <ChessPrintScreen id={`${scope}-square-light`} background="var(--chess-tile-light)" ink="var(--chess-grain-dark)" coverage={.18} unit={1}/>
    <ChessPrintScreen id={`${scope}-square-dark`} background="var(--chess-tile-dark)" ink="var(--chess-grain-light)" coverage={.25} unit={1}/>
    <ChessPrintScreen id={`${scope}-white`} background="var(--chess-piece-light)" ink="var(--chess-grain-dark)" coverage={.18} unit={1}/>
    <ChessPrintScreen id={`${scope}-black`} background="var(--chess-piece-dark)" ink="var(--chess-grain-light)" coverage={.25} unit={1}/>
  </>
}
