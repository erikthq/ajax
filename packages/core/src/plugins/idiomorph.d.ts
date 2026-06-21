declare module 'idiomorph' {
  interface MorphOptions {
    morphStyle?: 'innerHTML' | 'outerHTML'
  }

  const Idiomorph: {
    morph(oldNode: Element, newNode: Element | string, options?: MorphOptions): void
  }
}
