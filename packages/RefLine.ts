import { defineComponent, h } from 'vue'
import * as utils from './utils'
import { refLineProps as props } from './props'
import { refLineTypes } from './constant'

export default defineComponent({
  inheritAttrs: false,
  props,
  render () {
    const {
      points,
      refLineType,
      refLineProps,
      refLineStyles
    } = this
    const ypoints = points.map(p => p.y)
    let type = 'mean'

    if (typeof refLineType === 'string' && refLineTypes.includes(refLineType)) {
      if (refLineType === 'max') {
        type = 'min'
      } else if (refLineType === 'min') {
        type = 'max'
      } else {
        type = refLineType
      }
    }
    const y = type === 'custom' ? (refLineProps && refLineProps.value || utils['mean'](ypoints)) : utils[type](ypoints)

    refLineStyles['shape-rendering'] = 'crispEdges'

    return h('line', {
      style: refLineStyles,
      x1: points[0].x,
      y1: y,
      x2: points[points.length - 1].x,
      y2: y
    })
  }
})
