import {
  defineComponent,
  ref,
  unref,
  h,
  computed,
  provide,
  nextTick
} from 'vue'
import { sparklineProps as props } from './props'
import { SparkEvent, SetValueArgs } from './interface'
import * as utils from './utils'

let curEvt: Partial<SparkEvent> = {}

export default defineComponent({
  name: 'Sparklines',
  props,
  setup (props) {
    const isFocusing = ref(false)
    const indicator = ref<SVGGraphicsElement | null>(null)
    const tooltip = ref<HTMLElement | null>(null)
    const pointDatum = ref({})
    const svgMouseEvt = ref(true)
    const execMouseEvt = computed(() => {
      if (!props.indicatorStyles || !indicator.value || !svgMouseEvt.value) {
        return false
      }
      return true
    })
    const styles = computed(() => {
      const styles = props.styles

      styles.width = props.width
      styles.height = props.height

      return styles
    })
    const setStatus = (status = true) => {
      const display = status ? '' : 'none'

      tooltip.value && (tooltip.value.style.display = display)
      indicator.value && (indicator.value.style.display = display)
    }
    const updateData = () => {
      if (!isFocusing.value) {
        return false
      }

      let rect: Partial<DOMRect>
      let curData = null
      let tooltipContent = ''
      const pd = unref(pointDatum.value)

      for (const datum in pd) {
        curData = null
        if (pd.hasOwnProperty(datum)) {
          setStatus(false)
          for (const [i, p] of pd[datum].points.entries()) {
            if (curEvt.ox < p.x && curData === null) {
              setStatus()
              rect = tooltip.value?.getBoundingClientRect?.()
              curData = {
                value: pd[datum].data[i],
                color: pd[datum].color,
                index: i
              }
              tooltipContent += `<span style="color: ${curData.color};">&bull;</span>&nbsp;${curData.value}<br />`
            }
          }
        }
      }
      if (rect) {
        tooltip.value.style.left = `${curEvt.cx + rect.width / 2}px`
        tooltip.value.style.top = `${curEvt.cy - props.height - rect.height}px`
        try {
          tooltip.value.innerHTML = props.tooltipProps?.formatter?.(curData) || tooltipContent
        } catch (err) {
          tooltip.value.innerHTML = tooltipContent
        }
      }
    }
    const updateTooltip = utils.debounce(updateData, props.tooltipDelay)
    const updateValue = (value: SetValueArgs) => {
      const { id, data, points, color, limit } = value

      nextTick(() => {
        pointDatum.value[id] = {
          data: data.length >= limit ? data.slice(-limit) : data,
          points,
          color
        }

        Object.keys(curEvt).length && updateTooltip()
      })
    }

    provide('eventBus', {
      tooltip,
      setStatus,
      updateValue,
      svgMouseEvt,
      isFocusing
    })
  
    return {
      styles,
      updateData,
      isFocusing,
      setStatus,
      tooltip,
      indicator,
      updateTooltip,
      execMouseEvt
    }
  },
  render () {
    const {
      width,
      height,
      preserveAspectRatio,
      styles,
      indicatorStyles,
      tooltipStyles,
      setStatus,
      updateTooltip
    } = this

    return h('div', {
      'class': 'sparkline'
    }, [
      h('svg', {
        style: styles,
        viewBox: `0 0 ${width} ${height}`,
        preserveAspectRatio,
        onMousemove: (evt: MouseEvent) => {
          if (!this.execMouseEvt) {
            return
          }
          const ox = evt.offsetX
          const oy = evt.offsetY
          const cx = evt.clientX
          const cy = evt.clientY

          curEvt = {
            ox,
            oy,
            cx,
            cy,
            target: evt.target
          }

          this.indicator.setAttribute('x1', `${ox}`)
          this.indicator.setAttribute('x2', `${ox}`)
          this.isFocusing = true
          updateTooltip()
        },
        onMouseleave: () => {
          this.isFocusing = false
          setStatus(false)
        }
      },
      (() => {
        const items = this.$slots?.default?.() || []
        
        if (typeof indicatorStyles !== 'boolean') {
          indicatorStyles['shape-rendering'] = 'crispEdges'
          indicatorStyles['display'] = 'none'
          items.push(h('line', {
            style: indicatorStyles,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: height,
            ref: 'indicator'
          }))
        }

        return items
      })()),
      h('div', {
        'class': 'sparkline__tooltip',
        style: {...tooltipStyles, position: 'fixed'},
        ref: 'tooltip'
      })
    ])
  }
})
