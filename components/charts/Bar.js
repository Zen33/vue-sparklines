import RefLine from './RefLine'
import * as utils from './utils'

export default {
  name: 'sparkline-bar',
  props: ['data', 'limit', 'max', 'min', 'width', 'height', 'margin', 'styles', 'dataToPoints', 'refLineType', 'refLineStyles', 'bus', 'mouseEvents'],
  render (h) {
    const { data = [], limit, max, min, width, height, margin, styles, dataToPoints, refLineType, refLineStyles, bus, mouseEvents } = this
    if (!data.length) {
      return null
    }
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
    let adjustPos = []
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
              adjustPos[i] = adjustPos[i] || {}
              if (nonLimit) {
                const curX = Math.ceil((barWidth + strokeWidth + marginWidth) * i + margin)
                adjustPos[i].x = curX + barWidth
                return curX
              } else {
                const curX = Math.ceil(p.x - strokeWidth * i)
                adjustPos[i].x = curX + barWidth
                return curX
              }
            })(),
            // y: -height,
            y: (() => {
              return (adjustPos[i].y = Math.ceil(p.y))
            })(),
            width: Math.ceil(barWidth),
            height: Math.ceil(Math.max(0, height - p.y)),
            rel: data[i]
          },
          props: {
            key: i
          },
          on: utils['evt'](mouseEvents, data[i], p)
        }))
      })
      bus && bus.$emit('setValue', {
        id: `sparkline__${this._uid}`,
        color: styles.stroke || styles.fill || '#fff',
        data,
        points: adjustPos,
        limit,
        type: 'bar'
      })
      refLineStyles && items.push(h(RefLine, { props }))
      return items
    })())
  }
}
