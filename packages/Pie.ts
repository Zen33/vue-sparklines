import {
  defineComponent,
  h,
  inject,
  watch
} from 'vue'
import type { CSSProperties } from 'vue'
import { pieProps as props } from './props'
import { Pie, EventBus } from './interface'
import * as utils from './utils'

const getValue = (ref: Pie | number) => (typeof ref === 'object' && ref !== null) ? ref.value : ref as number
const getColor = (ref: Pie | number, styles: CSSProperties) => (typeof ref === 'object' && ref !== null) ? ref.color : (styles && styles.fill || utils.color())

export default defineComponent({
  name: 'SparklinePie',
  inheritAttrs: false,
  props,
  setup (props) {
    const eventBus = inject<EventBus>('eventBus')!
    const updateData = (evt: MouseEvent, value: number, color: string) => {
      const tooltip = eventBus.tooltip.value

      if (!tooltip) {
        return
      }
      tooltip.style.display = ''

      const rect = tooltip?.getBoundingClientRect?.()
      const tooltipContent = `<span style="color: ${color};">&bull;</span>&nbsp;${value}<br />`

      if (rect) {
        tooltip.style.left = `${evt.clientX + rect.width / 2}px`
        tooltip.style.top = `${evt.clientY - props.height - rect.height}px`
        try {
          tooltip.innerHTML = props.tooltipProps?.formatter?.({ value, color}) || tooltipContent
        } catch (err) {
          tooltip.innerHTML = tooltipContent
        }
      }
    }
    const updateTooltip = utils.debounce(updateData, props.tooltipDelay)

    watch(() => props.data, () => eventBus.setStatus(false))

    eventBus.svgMouseEvt.value = false
    return {
      eventBus,
      updateTooltip
    }
  },
  render () {
    const {
      data = [],
      width,
      height,
      styles,
      align
    } = this

    if (!data.length) {
      return null
    }
    const center = Math.min(width / 2, height / 2)
    const strokeWidth = styles && styles.strokeWidth || 0
    const radius = center - strokeWidth / 2
    const total = Math.ceil(data.reduce((a: Pie | number, b: Pie | number) => getValue(b) + getValue(a), 0))
    let angleStart = 0
    let angleEnd = 0
    let startX = center
    
    if (align === 'center') {
      startX = width / 2
    } else if (align === 'right') {
      startX = width - radius
    }

    return h('g', (() => {
      const items = []

      if (data.length === 1) {
        items.push(h('ellipse', {
          style: styles,
          cx: startX,
          cy: center,
          rx: radius,
          ry: radius,
          fill: getColor(data[0], styles),
          onMousemove: (evt: MouseEvent) => {
            evt.stopPropagation()
            this.eventBus.isFocusing.value = true
            this.updateTooltip(evt, getValue(data[0]),getColor(data[0], styles))
          },
          onMouseleave: () => {
            this.eventBus.isFocusing.value = false
            this.eventBus.setStatus(false)
          }
        }))
      } else {
        data.map((d: Pie | number, i: number) => {
          const value = getValue(d)
          const isLarge = value / total > 0.5
          const angle = 360 * value / total

          angleStart = angleEnd
          angleEnd = angleStart + angle

          const x1 = startX + radius * Math.cos(Math.PI * angleStart / 180)
          const y1 = center + radius * Math.sin(Math.PI * angleStart / 180)
          const x2 = startX + radius * Math.cos(Math.PI * angleEnd / 180)
          const y2 = center + radius * Math.sin(Math.PI * angleEnd / 180)
          const path = `M${startX},${center} L${x1},${y1} A${radius},${radius} 0 ${isLarge ? 1 : 0},1 ${x2},${y2} Z`
          const color = getColor(d, styles)

          items.push(h('path', {
            style: styles,
            fill: color,
            d: path,
            key: i,
            onMousemove: (evt: MouseEvent) => {
              evt.stopPropagation()
              this.eventBus.isFocusing.value = true
              this.updateTooltip(evt, value, color)
            },
            onMouseleave: (evt: MouseEvent) => {
              evt.stopPropagation()
              this.eventBus.isFocusing.value = false
              this.eventBus.setStatus(false)
            }
          }))
        })
      }
      return items
    })())
  }
})
