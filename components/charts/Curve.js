export default {
  props: ['data', 'hasSpot', 'spotlight', 'points', 'width', 'height', 'margin', 'color', 'curveStyles', 'spotStyles', 'spotProps', 'mouseEvents'],
  data () {
    return {
      curPoint: null
    }
  },
  watch: {
    curPoint (val) {
      const text = this.$parent.$refs.sparklineText
      const textRect = text.getBoundingClientRect()
      val && text && (text.style.left = `${val.x - textRect.width / 2}px`)
    }
  },
  render (h) {
    const { data, hasSpot, spotlight, points, width, height, margin, color, curveStyles, spotStyles, spotProps, mouseEvents, divisor = 0.5 } = this // 0.25
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
      stroke: color || curveStyles.stroke || 'slategray',
      strokeWidth: curveStyles.strokeWidth || '1',
      strokeLinejoin: curveStyles.strokeLinejoin || 'round',
      strokeLinecap: curveStyles.strokeLinecap || 'round',
      fill: 'none'
    }
    const fillStyle = {
      stroke: curveStyles.stroke || 'none',
      strokeWidth: '0',
      fillOpacity: curveStyles.fillOpacity || '.1',
      fill: curveStyles.fill || color || 'none'
    }
    const checkSpotType = (p, i) => {
      if (!hasSpot && typeof spotlight !== 'number') {
        return true
      } else if (!hasSpot && spotlight === i) {
        this.curPoint = p
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
        return checkSpotType(p, i) && items.push(h('circle', {
          style: spotStyles,
          attrs: {
            cx: p.x,
            cy: p.y,
            r: spotProps.size
          },
          on: {
            'click': () => { // mousedown
              mouseEvents && mouseEvents('enter', data[i], p)
            }
          }
        }))
      })
      return items
    })())
  }
}
