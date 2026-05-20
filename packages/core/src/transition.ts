export function startTransition(update: () => void, types?: string[]): ViewTransition | undefined {
  if (!document.startViewTransition) {
    update()
    return undefined
  }

  if (types?.length) {
    return document.startViewTransition({ update, types })
  }

  return document.startViewTransition(update)
}
