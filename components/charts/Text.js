export default {
  props: ['point', 'text', 'textStyles'],
  render (h) {
    const { point, text, textStyles } = this
    const { x, y } = point
    return h('g', [
      h('text', {
        style: textStyles,
        attrs: {
          x,
          y
        }
      }, text)
    ])
  }
}
