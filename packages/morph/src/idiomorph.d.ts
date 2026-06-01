declare module 'idiomorph' {
  interface MorphConfig {
    morphStyle?: 'innerHTML' | 'outerHTML'
    ignoreActive?: boolean
    ignoreActiveValue?: boolean
    head?: { style?: 'merge' | 'append' | 'morph' | 'none' }
    callbacks?: {
      beforeNodeAdded?: (node: Node) => boolean | void
      afterNodeAdded?: (node: Node) => void
      beforeNodeMorphed?: (oldNode: Node, newNode: Node) => boolean | void
      afterNodeMorphed?: (oldNode: Node, newNode: Node) => void
      beforeNodeRemoved?: (node: Node) => boolean | void
      afterNodeRemoved?: (node: Node) => void
    }
  }

  export const Idiomorph: {
    morph(
      oldNode: Element | Document,
      newContent: string | Element | Document | NodeList | Node[],
      config?: MorphConfig,
    ): Element[]
  }
}
