import { defineComponent, h } from 'vue'
import { gradientProps as props } from './props'

export default defineComponent({
  name: 'SparklineGradient',
  inheritAttrs: false,
  props,
  render () {
    const { gradient, id } = this

    if (!gradient.length) {
      return null
    }
    const len = gradient.length - 1 || 1
    const stops = gradient.slice().reverse().map((c: string, i: number) => h('stop', {
      offset: i / len,
      'stop-color': c,
      key: i
    }))

    return h('defs', [
      h('linearGradient', {
        id,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1
      }, stops)
    ])
  }
})
