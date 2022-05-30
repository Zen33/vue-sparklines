import { defineComponent, h } from 'vue'
import { spotProps as props } from './props'
import { Point } from './interface'

export default defineComponent({
  name: 'Spot',
  inheritAttrs: false,
  props,
  setup () {
    const lastPoint = (points: Point[]) => {
      const pl = points.length

      Math.sign = Math.sign || (x => {
        return x > 0 ? 1 : -1
      })
      return pl < 2 ? 0 : Math.sign(points[pl - 2].y - points[pl - 1].y)
    }

    return { lastPoint }
  },
  render () {
    const { points, spotStyles, spotProps } = this
    const pl = points.length

    return h('g', (() => {
      const items = []

      props.spotStyles && items.push(h('circle', {
        ...spotStyles,
        cx: points[0].x,
        cy: points[0].y,
        r: spotProps.size
      }))
      const style = spotStyles || spotProps.spotColors[this.lastPoint(points)]

      items.push(h('circle', {
        style,
        cx: points[pl - 1].x,
        cy: points[pl - 1].y,
        r: spotProps.size
      }))
      return items
    })())
  }
})
