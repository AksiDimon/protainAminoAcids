export interface PropsSequence {
    seq1: string,
    seq2:string,
    showViewer: boolean,
    onCopy: (str:string) => void
}

export const colorsMap: Record<string, string> = {
      A: '#67E4A6', I: '#67E4A6', L: '#67E4A6', M: '#67E4A6',
  F: '#67E4A6', W: '#67E4A6', Y: '#67E4A6', V: '#67E4A6', P: '#67E4A6',
  C: '#FFEA00',
  G: '#C4C4C4',
  D: '#FC9CAC', E: '#FC9CAC',
  K: '#BB99FF', R: '#BB99FF',
  S: '#80BFFF', T: '#80BFFF', H: '#80BFFF', Q: '#80BFFF', N: '#80BFFF',
}