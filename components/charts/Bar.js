import RefLine from './RefLine'
import * as utils from './utils'

export default {
  name: 'sparkline-bar',
  props: ['data', 'limit', 'max', 'min', 'width', 'height', 'margin', 'styles', 'dataToPoints', 'refLineType', 'refLineStyles', 'mouseEvents'],
  render (h) {
    const { data = [], limit, max, min, width, height, margin, styles, dataToPoints, refLineType, refLineStyles, mouseEvents } = this
    const points = dataToPoints({
      data,
      limit,
      width,
      height,
      margin,
      max,
      min
    })
    const strokeWidth = styles && styles.strokeWidth || 0
    const marginWidth = margin ? 2 * margin : 0
    const nonLimit = data.length === limit
    const barWidth = styles.barWidth || nonLimit ? ((width - limit * (marginWidth + strokeWidth )) / limit)  : (points && points.length >= 2 ? Math.max(0, points[1].x - points[0].x - strokeWidth - marginWidth) : 0)
    const props = this.$props
    props.points = points
    return h('g', {
      attrs: {
        // transform: `scale(1, -1)`
      }
    }, (() => {
      const items = []
      points.map((p, i) => {
        return items.push(h('rect', {
          style: styles,
          attrs: {
            // x: p.x - (barWidth + strokeWidth) / 2,
            x: (() => {
              if (nonLimit) {
                return Math.ceil((barWidth + strokeWidth + marginWidth) * i + margin)
              } else {
                return Math.ceil(p.x - strokeWidth * i)
              }
            })(),
            // y: -height,
            y: Math.ceil(p.y),
            width: Math.ceil(barWidth),
            height: Math.ceil(Math.max(0, height - p.y)),
          },
          props: {
            key: i
          },
          on: utils['evt'](mouseEvents, data[i], p)
        }))
      })
      refLineStyles && items.push(h(RefLine, { props }))
      return items
    })())
  }
}
