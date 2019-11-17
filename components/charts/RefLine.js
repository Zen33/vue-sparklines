import * as utils from './utils'

export default {
  props: ['points', 'margin', 'refLineType', 'refLineProps', 'refLineStyles'],
  render (h) {
    const {
      points,
      // margin,
      refLineType,
      refLineProps,
      refLineStyles
    } = this
    const ypoints = points.map(p => p.y)
    const types = ['max', 'min', 'mean', 'avg', 'median', 'custom']
    let type = 'mean'

    if (types.indexOf(refLineType) > -1) {
      if (refLineType === 'max') {
        type = 'min'
      } else if (refLineType === 'min') {
        type = 'max'
      } else {
        type = refLineType
      }
    }

    const y = type == 'custom' ? (refLineProps && refLineProps.value || utils['mean'](ypoints)) : utils[type](ypoints)

    refLineStyles['shape-rendering'] = 'crispEdges'
    return h('line', {
      style: refLineStyles,
      attrs: {
        x1: points[0].x,
        y1: y,
        x2: points[points.length - 1].x,
        y2: y
      }
    })
  }
}
