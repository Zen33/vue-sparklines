import Spot from './Spot'
import Text from './Text'
import RefLine from './RefLine'
import * as utils from './utils'

export default {
  name: 'sparkline-curve',
  props: ['data', 'hasSpot', 'limit', 'max', 'min', 'spotlight', 'width', 'height', 'margin', 'styles', 'spotStyles', 'spotProps', 'dataToPoints', 'refLineType', 'refLineStyles', 'textStyles', 'mouseEvents'],
  render (h) {
    const { data = [], hasSpot, limit, max, min, spotlight, width, height, margin, styles, spotStyles, spotProps, dataToPoints, refLineType, refLineStyles, textStyles, mouseEvents, divisor = 0.5 } = this // 0.25
    const hasSpotlight = typeof spotlight === 'number'
    const leeway = 10
    const points = dataToPoints({
      data,
      limit,
      width,
      height,
      margin,
      max,
      min,
      textHeight: hasSpotlight ? leeway : 0
    })
    let prev
    const curve = p => {
      let res
      if (!prev) {
        res = [p.x, p.y]
      } else {
        const len = (p.x - prev.x) * divisor
        res = [
          'C',
          prev.x + len,
          prev.y,
          p.x - len,
          p.y,
          p.x,
          p.y
        ]
      }
      prev = p
      return res
    }
    const linePoints = points.map(p => curve(p)).reduce((a, b) => a.concat(b))
    const closePolyPoints = [
      `L${points[points.length - 1].x}`,
      height - margin,
      margin,
      height - margin,
      margin,
      points[0].y
    ]
    const fillPoints = linePoints.concat(closePolyPoints)
    const lineStyle = {
      stroke: styles.stroke || 'slategray',
      strokeWidth: styles.strokeWidth || '1',
      strokeLinejoin: styles.strokeLinejoin || 'round',
      strokeLinecap: styles.strokeLinecap || 'round',
      fill: 'none'
    }
    const fillStyle = {
      stroke: styles.stroke || 'none',
      strokeWidth: '0',
      fillOpacity: styles.fillOpacity || '.1',
      fill: styles.fill || 'none'
    }
    const props = this.$props
    props.points = points
    const checkSpotType = (items, p, i) => {
      if (!hasSpot && !hasSpotlight) {
        return true
      } else if (!hasSpot && spotlight === i) {
        props.text = data[spotlight]
        props.point = p
        items.push(h(Text, { props }))
        return true
      }
      return false
    }
    return h('g', (() => {
      const items = []
      items.push(h('path', {
        style: fillStyle,
        attrs: {
          d: `M${fillPoints.join(' ')}`
        }
      }),
      h('path', {
        style: lineStyle,
        attrs: {
          d: `M${linePoints.join(' ')}`
        }
      }))
      points.map((p, i) => {
        return checkSpotType(items, p, i) && items.push(h('circle', {
          style: spotStyles,
          attrs: {
            cx: p.x,
            cy: p.y,
            r: spotProps.size
          },
          props: {
            key: i
          },
          on: utils['evt'](mouseEvents, data[i], p)
        }))
      })
      hasSpot && items.push(h(Spot, { props }))
      refLineStyles && items.push(h(RefLine, { props }))
      return items
    })())
  }
}
