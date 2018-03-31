export default {
  props: ['points', 'spotStyles', 'spotProps', 'onMouseMove'],
  methods: {
    lastDirection (points) {
      const pl = points.length
      Math.sign = Math.sign || (x => {
        return x > 0 ? 1 : -1
      })
      return pl < 2 ? 0 : Math.sign(points[pl - 2].y - points[pl - 1].y)
    }
  },
  render (h) {
    const { points, spotStyles, spotProps } = this
    const pl = points.length
    return h('g', (() => {
      const items = []
      spotStyles && items.push(h('circle', {
        style: spotStyles,
        attrs: {
          cx: points[0].x,
          cy: points[0].y,
          r: spotProps.size
        }
      }))
      items.push(h('circle', {
        style: spotStyles || {
          fill: spotProps.spotColors[this.lastDirection(points)]
        },
        attrs: {
          cx: points[pl - 1].x,
          cy: points[pl - 1].y,
          r: spotProps.size
        }
      }))
      return items
    })())
  }
}
