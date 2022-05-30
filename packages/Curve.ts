import { defineComponent, h, inject } from 'vue'
import type { VNode } from 'vue'
import Spot from './Spot'
import RefLine from './RefLine'
import { curveProps as props } from './props'
import { Point, EventBus } from './interface'
import useSpotCheck from './hooks/useSpotCheck'
import useStyles from './hooks/useStyles'
import * as utils from './utils'

export default defineComponent({
  name: 'SparklineCurve',
  inheritAttrs: false,
  props,
  setup (props) {
    const eventBus = inject<EventBus>('eventBus')!
    const id = utils.uid()
    const { checkSpotType } = useSpotCheck()
    const { lineStyle, fillStyle } = useStyles(props.styles)

    return {
      eventBus,
      id,
      checkSpotType,
      lineStyle,
      fillStyle
    }
  },
  render () {
    const {
      id,
      data,
      hasSpot,
      spotProps,
      spotlight,
      spotStyles,
      limit,
      width,
      height,
      margin,
      max,
      min,
      styles,
      refLineStyles,
      divisor,
      eventBus,
      checkSpotType,
      lineStyle,
      fillStyle
    } = this

    if (!data.length) {
      return null
    }
    const props = this.$props
    const hasSpotlight = typeof spotlight === 'number'
    const leeway = 10
    const points = utils.dataToPoints({
      data,
      limit,
      width,
      height,
      margin,
      max,
      min,
      textHeight: hasSpotlight ? leeway : 0
    })
    let prev: Partial<Point>
    const curve = (p: Point) => {
      let result: unknown[] = []

      if (!prev) {
        result = [p.x, p.y]
      } else {
        const len = (p.x - prev.x) * divisor

        result = [
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

      return result
    }
    const linePoints = points.map((p: Point) => curve(p)).reduce((a: number[], b: number[]) => a.concat(b))
    const closePolyPoints = [
      `L${points[points.length - 1].x}`,
      height - margin,
      margin,
      height - margin,
      margin,
      points[0].y
    ]
    const fillPoints = linePoints.concat(closePolyPoints)

    eventBus.updateValue({
      id: `sparkline__${id}`,
      color: styles.stroke || styles.fill || '#fff',
      data,
      points,
      limit,
      type: 'curve'
    })

    return h('g', (() => {
      const items: VNode[] = []

      items.push(h('path', {
        style: fillStyle,
        d: `M${fillPoints.join(' ')}`
      }),
      h('path', {
        style: lineStyle,
        d: `M${linePoints.join(' ')}`
      }))
      hasSpotlight && points.map((p: Point, key: number) => checkSpotType({
        props,
        items,
        point: p,
        i: key,
        hasSpotlight
      }) && items.push(h('circle', {
        style: spotStyles,
        cx: p.x,
        cy: p.y,
        r: spotProps.size,
        rel: data[key],
        key
      })))
      hasSpot && items.push(h(Spot, { ...props, points }))
      !utils.isEmpty(refLineStyles) && items.push(h(RefLine, { ...props, points }))

      return items
    })())
  }
})
