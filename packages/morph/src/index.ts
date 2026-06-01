import { Idiomorph } from 'idiomorph'
import type { QutePlugin, SwapStrategy } from '@qute/core'

function morphSwap(oldEl: Element, newEl: Element, mode?: SwapStrategy): Element {
  Idiomorph.morph(oldEl, newEl, {
    morphStyle: mode === 'innerHTML' ? 'innerHTML' : 'outerHTML',
  })
  return oldEl
}

export const morphPlugin: QutePlugin = { swap: morphSwap }
