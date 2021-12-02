import Vue from 'vue'
import Line from './Line'
import Curve from './Curve'
import Bar from './Bar'
import Pie from './Pie'
import MaxZIndex from './mixins'

export default {
  name: 'sparkline',
  mixins: [MaxZIndex],
  props: {
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 30
    },
    preserveAspectRatio: {
      type: String,
      default: 'none'
    },
    margin: {
      type: Number,
      default: 2
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    indicatorStyles: {
      type: [Object, Boolean],
      default: () => ({
        stroke: 'red'
      })
    },
    tooltipProps: {
      type: Object,
      default: () => ({
        formatter () {
          return null
        }
      })
    },
    tooltipStyles: {
      type: Object,
      default: () => ({
        position: 'absolute',
        display: 'none',
        background: 'rgba(0, 0, 0, 0.6)',
        borderRadius: '3px',
        minWidth: '30px',
        padding: '3px',
        color: '#fff',
        fontSize: '12px'
      })
    }
  },
  data () {
    return {
      datum: {},
      curEvt: {},
      onFocus: false
    }
  },
  created () {
    this.bus.$on('setValue', val => {
      const { data, points, color, limit } = val

      this.datum[val.id] = {
        data: data.length >= limit ? data.slice(-limit) : data,
        points,
        color
      }
      Object.keys(this.curEvt).length && this.updateData()
    })
  },
  mounted () {
    const fragment = document.createDocumentFragment()

    fragment.appendChild(this.$refs.sparklineTooltip)
    document.body.appendChild(fragment)
  },
  beforeDestroy () {
    const tooltip = this.$refs.sparklineTooltip

    tooltip && tooltip.parentNode.removeChild(tooltip)
  },
  computed: {
    bus () {
      return new Vue()
    }
  },
  methods: {
    setStatus (status = true) {
      const indicator = this.$refs.sparklineIndicator
      const tooltip = this.$refs.sparklineTooltip

      tooltip && (tooltip.style.display = status ? '' : 'none')
      indicator && (indicator.style.display = status ? '' : 'none')
    },
    updateData () {
      if (!this.onFocus) {
        return false
      }

      let rect
      let curData
      let tooltipContent = ''
      const tooltip = this.$refs.sparklineTooltip

      for (let datum in this.datum) {
        curData = null
        if (this.datum.hasOwnProperty(datum)) {
          this.setStatus(false)
          for (let [index, pos] of this.datum[datum].points.entries()) {
            if (this.curEvt.ox < pos.x && curData === null) {
              this.setStatus()
              rect = tooltip.getBoundingClientRect()
              curData = {
                value: this.datum[datum].data[index],
                color: this.datum[datum].color,
                index
              }
              tooltipContent += `<span style="color:${curData.color};">&bull;</span>&nbsp;${curData.value}<br />`
            }
          }
        }
      }
      if (rect) {
        tooltip.style.left = `${this.curEvt.cx + rect.width * .25}px`
        tooltip.style.top = `${this.curEvt.cy - rect.height}px`
        tooltip.style.zIndex = this.zIndex
        try {
          tooltip.innerHTML = this.tooltipProps.formatter(curData) || tooltipContent
        } catch (e) {
          return (tooltip.innerHTML = tooltipContent)
        }
      }
    }
  },
  render (h) {
    const {
      width,
      height,
      preserveAspectRatio,
      styles,
      indicatorStyles
    } = this
    const svgOpts = {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio
    }

    styles.width = `${parseInt(width, 10)}px`
    styles.height = `${parseInt(height, 10)}px`

    const rootProps = this.$props

    indicatorStyles && (rootProps.bus = this.bus)

    const slots = this.$slots.default

    return h('div', {
      'class': 'sparkline-wrap'
    }, [
      h('svg', {
        style: styles,
        attrs: svgOpts,
        on: {
          mousemove: evt => {
            if (indicatorStyles) {
              const ox = evt.offsetX || evt.layerX
              const oy = evt.offsetY || evt.layerY
              const cx = evt.clientX
              const cy = evt.clientY

              this.curEvt = {
                ox,
                oy,
                cx,
                cy,
                target: evt.target
              }

              const indicator = this.$refs.sparklineIndicator

              indicator.setAttribute('x1', ox)
              indicator.setAttribute('x2', ox)
            }
            this.onFocus = true
            this.updateData()
          },
          mouseleave: () => {
            this.onFocus = false
            this.setStatus(false)
          }
        }
      }, (() => {
        const items = slots.map(item => {
          const tag = item.tag
          const props = Object.assign({}, rootProps, item.data && item.data.attrs || {})

          if (tag.toLowerCase() === 'sparklineLine') {
            return h(Line, { props })
          } else if (tag.toLowerCase() === 'sparklinecurve') {
            return h(Curve, { props })
          } else if (tag.toLowerCase() === 'sparklinebar') {
            return h(Bar, { props })
          } else {
            return h(Pie, { props })
          }
        })

        if (indicatorStyles) {
          indicatorStyles['shape-rendering'] = 'crispEdges'
          indicatorStyles['display'] = 'none'
          items.push(h('line', {
            style: indicatorStyles,
            attrs: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: height
            },
            ref: 'sparklineIndicator'
          }))
        }
        return items
      })()),
      h('div', {
        'class': 'sparkline-tooltip',
        style: this.tooltipStyles,
        ref: 'sparklineTooltip'
      })
    ])
  }
}
