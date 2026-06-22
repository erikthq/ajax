import ajax, {
  morph,
  preload,
  debug,
  loading,
  history,
  headers,
  head,
} from '@erikt/ajax'

ajax.use(preload({ strategy: 'fetch' }))
// ajax.use(morph)
// ajax.use(debug)
// ajax.use(loading())

ajax.use(head({ title: true }))

ajax.register({
  target: '#link-store',
  plugins: [history('push')],
  swaps: [{ replace: '#main' }],
})

ajax.register({
  target: '#cart-button',
  transitions: ['slide-left'],
  plugins: [history('push')],
  swaps: [{ replace: '#main' }],
})

ajax.register({
  target: '#cart-page form',
  trigger: ['change', 'submit'],
  transitions: ['update-cart-page', 'update-cart-count'],
  swaps: [
    {
      replace: '#cart-page ul',
      with: ['#cart-page ul', '#cart-page .empty'],
      mode: 'outerHTML',
      if: (current, next) => current.children.length !== next.children.length,
    },
    {
      replace: '#cart-button',
      mode: 'outerHTML',
    },
  ],
})

ajax.register({
  target: '#product form',
  transitions: ['update-cart-count'],
  swaps: [{ replace: '#cart-button' }],
})

ajax.register({
  target: '#login-form form',
  transitions: ['form-submitted', 'user-login'],
  swaps: [
    {
      replace: '#login-form',
      with: '#form-response',
    },
    {
      replace: '#profile',
      with: '#user',
      mode: 'outerHTML',
    },
  ],
})

let dir = 'down'

function change() {
  document.startViewTransition({
    update: () => {
      document.querySelector('.idle-view-transition').style.translate =
        dir === 'down' ? '0 100px' : '0 0px'

      if (dir === 'down') {
        dir = 'up'
      } else {
        dir = 'down'
      }
    },
    types: ['idle-view-transition'],
  })
}

setTimeout(change, 100)
// setInterval(change, 3000);
