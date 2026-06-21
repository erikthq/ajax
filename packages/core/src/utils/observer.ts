type WithTarget = { target: string }

export function observe<T extends WithTarget>(
  store: Map<string, Set<T>>,
  attach: (element: HTMLElement, config: T) => void,
): void {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue

        for (const [, configs] of store) {
          for (const config of configs) {
            const candidates = [
              ...(node.matches(config.target) ? [node] : []),
              ...node.querySelectorAll<HTMLElement>(config.target),
            ]
            for (const el of candidates) {
              attach(el, config)
            }
          }
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}
