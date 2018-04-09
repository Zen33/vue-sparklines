import Line from './Line'
import Curve from './Curve'
import Bar from './Bar'
// import Pie from './Pie' // TODO
import dataToPoints from './utils/dataToPoints'

export default {
  name: 'sparkline',
  props: {
    // data: {
    //   type: Array,
    //   default: []
    //   // required: true
    // },
    // point: {
    //   type: Object,
    //   default: {
    //     x: 0,
    //     y: 0
    //   }
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
    hasSpot: {
      type: Boolean,
      default: false
    },
    spotProps: {
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
    spotStyles: {
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
    refLineProps: {
      type: Object,
      default: () => ({
        value: null
      })
    },
    // text: {
    //   type: String,
    //   default: ''
    // },
    styles: {
      type: Object,
      default: () => ({})
    },
    textStyles: {
      type: Object,
      default: () => ({
        fontSize: 10
      })
    }
  },
  render (h) {
    const { width, height, preserveAspectRatio, margin, max, min, hasSpot, spotProps, refLineType, refLineProps, styles, textStyles } = this
    const svgOpts = {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio
    }
    styles.width = width
    styles.height = height
    const rootProps = this.$props
    rootProps.dataToPoints = dataToPoints
    const slots = this.$slots.default
    return h('div', {
      'class': 'sparkline-wrap'
    }, [
      h('svg', {
        style: styles,
        attrs: svgOpts
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
          // } else { // TODO
          //   return h(Pie, { props })
          }
        })
        return items
      })())
    ])
  }
}
