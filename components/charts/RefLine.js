import * as utils from './utils'

export default {
  props: ['points', 'margin', 'refLineType', 'refLineProps', 'refLineStyles'],
  render (h) {
    const { points, margin, refLineType, refLineProps, refLineStyles } = this
    const ypoints = points.map(p => p.y)
    const y = refLineType == 'custom' ? refLineProps.value : utils[refLineType](ypoints)
    refLineStyles['shape-rendering'] = 'crispEdges' // 去除line虚化
    return h('line', {
      style: refLineStyles,
      attrs: {
        x1: points[0].x,
        y1: y + margin,
        x2: points[points.length - 1].x,
        y2: y + margin
      }
    })
  }
}
