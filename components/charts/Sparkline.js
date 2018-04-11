import Vue from 'vue'
import Line from './Line'
import Curve from './Curve'
import Bar from './Bar'
import Pie from './Pie'
import dataToPoints from './utils/dataToPoints'

export default {
  name: 'sparkline',
  props: {
    // data: {
    //   type: Array,
    //   default: []
    //   // required: true
    // },
    spotlight: { // 高亮显示索引值
      type: [Number, Boolean],
      default: false
    },
    limit: { // 单次呈现数据点集数量
      type: [Number, String],
      default: 3
    },
    width: {
      type: [Number, String],
      default: 100
    },
    height: {
      type: [Number, String],
      default: 30
    },
    preserveAspectRatio: { // 是否scale
      type: String,
      default: 'none'
    },
    margin: {
      type: Number,
      default: 3
    },
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    hasSpot: { // 是否有端点
      type: Boolean,
      default: false
    },
    spotProps: { // 端点属性
      type: Object,
      default: () => ({
        size: 3,
        spotColors: {
          '-1': 'red',
          '0': 'yellow',
          '1': 'green'
        }
      })
    },
    spotStyles: { // 端点样式
      type: Object,
      default: () => ({
        strokeOpacity: 0,
        fillOpacity: 0
      })
    },
    refLineType: { // 参考线样式'max', 'min', 'mean', 'avg', 'median', 'custom' or false
      type: [String, Boolean],
      default: 'mean'
    },
    refLineProps: { // 参考线属性
      type: Object,
      default: () => ({
        value: null
      })
    },
    styles: { // sparkline样式
      type: Object,
      default: () => ({})
    },
    textStyles: { // 高亮文字样式
      type: Object,
      default: () => ({
        fontSize: 10
      })
    },
    indicatorStyles: { // 指示器样式
      type: [Object, Boolean],
      default: () => ({
        stroke: 'red'
      })
    },
    tooltipProps: { // tooltip属性
      type: Object,
      default: () => ({
        formatter () {
          return null
        }
      })
    },
    tooltipStyles: { // tooltip样式
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
    updateData() {
      if (!this.onFocus) {
        return false
      }
      let leeway
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
              leeway = tooltip.getBoundingClientRect()
              curData = {
                value: this.datum[datum].data[index],
                color: this.datum[datum].color
              }
              tooltipContent += `<span style="color:${curData.color};">&bull;</span>&nbsp;${curData.value}<br />`
            }
          }
        }
      }
      if (leeway) {
        tooltip.style.left = `${this.curEvt.cx + leeway.width * .25}px`
        tooltip.style.top = `${this.curEvt.cy - leeway.height}px`
        try {
          tooltip.innerHTML = this.tooltipProps.formatter(curData) || tooltipContent
        } catch (e) {
          return (tooltip.innerHTML = tooltipContent)
        }
      }
    }
  },
  render (h) {
    const { width, height, preserveAspectRatio, margin, max, min, hasSpot, spotProps, refLineType, refLineProps, styles, textStyles, indicatorStyles, tooltipProps } = this
    const svgOpts = {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio
    }
    styles.width = width
    styles.height = height
    const rootProps = this.$props
    rootProps.dataToPoints = dataToPoints
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
          if (tag === 'sparklineLine') {
            return h(Line, { props })
          } else if (tag === 'sparklineCurve') {
            return h(Curve, { props })
          } else if (tag === 'sparklineBar') {
            return h(Bar, { props })
          } else {
            return h(Pie, { props })
          }
        })
        if (indicatorStyles) {
          indicatorStyles['shape-rendering'] = 'crispEdges' // 去除line虚化
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
