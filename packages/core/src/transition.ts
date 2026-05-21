export function startTransition(update: () => void, types?: string[]): Promise<void> {
  if (!document.startViewTransition) {
    update()
    return Promise.resolve()
  }

  const vt = types?.length
    ? document.startViewTransition({ update, types })
    : document.startViewTransition(update)

  return vt.updateCallbackDone
}
