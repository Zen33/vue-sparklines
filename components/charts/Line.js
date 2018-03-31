export default {
  props: ['data', 'hasSpot', 'points', 'width', 'height', 'margin', 'color', 'lineStyles', 'spotStyles', 'spotProps', 'mouseEvents'],
  render (h) {
    const { data, hasSpot, points, width, height, margin, color, lineStyles, spotStyles, spotProps, mouseEvents } = this
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
      stroke: color || lineStyles.stroke || 'slategray',
      strokeWidth: lineStyles.strokeWidth || '1',
      strokeLinejoin: lineStyles.strokeLinejoin || 'round',
      strokeLinecap: lineStyles.strokeLinecap || 'round',
      fill: 'none'
    }
    const fillStyle = {
      stroke: lineStyles.stroke || 'none',
      strokeWidth: '0',
      fillOpacity: lineStyles.fillOpacity || '.1',
      fill: lineStyles.fill || color || 'none', // slategray
      pointerEvents: 'auto'
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
      points.map((p, i) => {
        return !hasSpot && items.push(h('circle', {
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
