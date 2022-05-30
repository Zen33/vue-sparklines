import { defineComponent, h, inject } from 'vue'
import { barProps as props } from './props'
import RefLine from './RefLine'
import { Point, EventBus } from './interface'
import * as utils from './utils'

export default defineComponent({
  name: 'SparklineBar',
  inheritAttrs: false,
  props,
  setup () {
    const eventBus = inject<EventBus>('eventBus')!
    const id = utils.uid()

    return {
      eventBus,
      id
    }
  },
  render () {
    const {
      id,
      data = [],
      limit,
      width,
      height,
      margin,
      styles,
      max,
      min,
      refLineStyles,
      eventBus
    } = this

    if (!data.length) {
      return null
    }
    const props = this.$props
    const points: Point[] = utils.dataToPoints({
      data,
      limit,
      width,
      height,
      margin,
      max,
      min
    })
    const strokeWidth = styles && styles.strokeWidth || 0
    const marginWidth = margin || 0
    const nonLimit = data.length === limit
    const limitedWidth = nonLimit ? 
      (width - limit * (marginWidth + strokeWidth )) / limit : (points && points.length >= 2 ?
        Math.max(0, points[1].x - points[0].x - strokeWidth - marginWidth) : 0)
    let minWidth: number

    if (!isNaN(limitedWidth) && limitedWidth < 0) {
      minWidth = 1
    } else {
      minWidth = limitedWidth
    }

    if (minWidth === 0) {
      return console.warn(`[vue-sparklines]: The limit value is too large.`)
    }

    const adjustPos: Partial<Point[]> = []
    const barWidth = styles.barWidth || minWidth

    return h('g', (() => {
      const items = []

      points.map((p, i) => {
        const curW = Math.ceil(barWidth)
        const curH = Math.ceil(Math.max(0, height - p.y))

        return items.push(h('rect', {
          style: {
            ...styles,
            width: `${curW}px`,
            height: `${curH}px`
          },
          // x: p.x - (barWidth + strokeWidth) / 2,
          x: (() => {
            adjustPos[i] = adjustPos[i] || { x: 0, y: 0}
            if (nonLimit) {
              const curX = Math.ceil((barWidth + strokeWidth + marginWidth) * i + margin)

              adjustPos[i].x = curX + barWidth
              return curX
            }
            const curX = Math.ceil(p.x - strokeWidth * i)

            adjustPos[i].x = curX + barWidth
            return curX
          })(),
          // y: -height,
          y: (() => (adjustPos[i].y = Math.ceil(p.y)))(),
          width: curW,
          height: curH,
          rel: data[i],
          key: i
        }))
      })

      eventBus.updateValue({
        id: `sparkline__${id}`,
        color: styles.stroke || styles.fill || '#fff',
        data,
        points: adjustPos,
        limit,
        type: 'bar'
      })
      !utils.isEmpty(refLineStyles) && items.push(h(RefLine, { ...props, points }))

      return items
    })())
  }
})
