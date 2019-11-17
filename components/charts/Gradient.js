export default {
  props: ['gradient', 'id'],
  render (h) {
    const { gradient, id } = this
    const len = gradient.length - 1 || 1
    const stops = gradient.slice().reverse().map((c, i) => h('stop', {
      attrs: {
        offset: i / len,
        'stop-color': c
      },
      props: {
        key: i
      }
    }))

    return h('defs', [
      h('linearGradient', {
        attrs: {
          id,
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
        }
      }, stops)
    ])
  }
}
