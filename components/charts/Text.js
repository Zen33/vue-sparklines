export default {
  props: ['point', 'margin', 'text', 'textStyles'],
  render (h) {
    const { point, text, textStyles } = this
    const { x, y } = point

    return h('g', [
      h('text', {
        style: textStyles,
        attrs: {
          x,
          y
        },
        ref: 'sparklineText'
      }, text)
    ])
  },
  mounted () {
    const text = this.$refs.sparklineText
    const textBox = text && text.getBBox()

    if (textBox) {
      text.setAttribute('x', textBox.x - textBox.width / 2)
      text.setAttribute('y', this.margin + textBox.height / 2)
    }
  }
}
