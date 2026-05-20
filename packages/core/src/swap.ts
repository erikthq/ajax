import type { SwapStrategy } from './types.js'

function executeScripts(root: Element): void {
  for (const script of root.querySelectorAll('script')) {
    const next = document.createElement('script')
    for (const { name, value } of script.attributes) {
      next.setAttribute(name, value)
    }
    next.textContent = script.textContent
    script.replaceWith(next)
  }
}

export function swap(target: Element, fragment: Element, strategy: SwapStrategy = 'innerHTML'): void {
  switch (strategy) {
    case 'innerHTML':
      target.innerHTML = fragment.innerHTML
      executeScripts(target)
      break

    case 'outerHTML': {
      const marker = document.createComment('qute')
      target.before(marker)
      target.outerHTML = fragment.outerHTML
      const newEl = marker.nextElementSibling
      marker.remove()
      if (newEl) executeScripts(newEl)
      break
    }

    case 'beforebegin':
    case 'afterbegin':
    case 'beforeend':
    case 'afterend':
      target.insertAdjacentHTML(strategy, fragment.innerHTML)
      break
  }
}
