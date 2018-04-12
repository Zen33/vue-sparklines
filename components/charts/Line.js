import Spot from './Spot'
import Text from './Text'
import RefLine from './RefLine'
import * as utils from './utils'

export default {
  name: 'sparkline-line',
  props: ['data', 'hasSpot', 'limit', 'max', 'min', 'spotlight', 'width', 'height', 'margin', 'styles', 'spotStyles', 'spotProps', 'dataToPoints', 'refLineType', 'refLineStyles', 'textStyles', 'bus', 'mouseEvents'],
  render (h) {
    const { data = [], hasSpot, limit, max, min, spotlight, width, height, margin, styles, spotStyles, spotProps, dataToPoints, refLineType, refLineStyles, textStyles, bus, mouseEvents } = this
    if (!data.length) {
      return null
    }
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
    bus && bus.$emit('setValue', {
      id: `sparkline__${this._uid}`,
      color: styles.stroke || styles.fill || '#fff',
      data,
      points,
      limit,
      type: 'line'
    })
    const linePoints = points.map(p => [p.x, p.y]).reduce((a, b) => a.concat(b))
    const closePolyPoints = [
      points[points.length - 1].x,
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
      fill: styles.fill || 'none', // slategray
      pointerEvents: 'auto'
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
      items.push(h('polyline', {
        style: fillStyle,
        attrs: {
          points: fillPoints.join(' ')
        }
      }),
      h('polyline', {
        style: lineStyle,
        attrs: {
          points: linePoints.join(' ')
        }
      }))
      hasSpotlight && points.map((p, i) => {
        return checkSpotType(items, p, i) && items.push(h('circle', {
          style: spotStyles,
          attrs: {
            cx: p.x,
            cy: p.y,
            r: spotProps.size,
            rel: data[i]
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
