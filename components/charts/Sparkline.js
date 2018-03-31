import Line from './Line'
import Curve from './Curve'
// import Bar from './Bar' // TODO
import Spot from './Spot'
import RefLine from './RefLine'
import Text from './Text'
import dataToPoints from './utils/dataToPoints'

export default {
  name: 'sparkline',
  props: {
    data: {
      type: Array,
      default: [],
      required: true
    },
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
    svgWidth: {
      type: [Number, String]
    },
    svgHeight: {
      type: [Number, String]
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
    color: {
      type: String
    },
    mouseEvents: {
      type: Function
    },
    children: { // 图表子集：['line'], ['curve', 'bar']...
      type: Array,
      default: () => ['curve']
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
          '0': 'black',
          '1': 'green'
        }
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
    text: {
      type: String,
      default: ''
    },
    // 各自图形样式如下
    sparklineStyles: {
      type: Object,
      default: () => ({})
    },
    lineStyles: {
      type: Object,
      default: () => ({
        strokeWidth: 2,
        stroke: '#fff'
      })
    },
    curveStyles: {
      type: Object,
      default: () => ({
        strokeWidth: 2,
        stroke: '#fff' 
      })
    },
    spotStyles: {
      type: Object,
      default: () => ({
        fill: '#fff'
      })
    },
    // barStyles: { // TODO
    //   type: Object,
    //   default: () => ({})
    // },
    refLineStyles: {
      type: Object,
      default: () => ({
        stroke: '#fff',
        strokeOpacity: 1,
        strokeDasharray: '5, 5'
      })
    },
    textStyles: {
      type: Object,
      default: () => ({
        color: '#fff',
        fontSize: '10px'
      })
    }
  },
  render (h) {
    const { data, limit, text, spotlight, width, height, svgWidth, svgHeight, preserveAspectRatio, margin, max, min, color, mouseEvents, children, hasSpot, spotProps, refLineType, refLineProps, sparklineStyles, lineStyles, curveStyles, spotStyles, barStyles, refLineStyles, textStyles } = this
    if (!data.length) {
      return null
    }
    const points = dataToPoints({
      data,
      limit,
      width,
      height,
      margin,
      max,
      min
    })
    const svgOpts = {
      viewBox: `0 0 ${width} ${height}`,
      preserveAspectRatio
    }
    sparklineStyles.width = width
    sparklineStyles.height = height
    const props = this.$props
    props.points = points
  
    svgWidth > 0 && (svgOpts.width = svgWidth)
    svgHeight > 0 && (svgOpts.height = svgHeight)

    return h('div', {
      'class': 'sparkline-wrap'
    }, [
      h('svg', {
        style: sparklineStyles,
        attrs: {
          viewBox: `0 0 ${width} ${height}`,
          preserveAspectRatio
        }
      }, (() => {
        const items = children.map(item => {
          if (item === 'line') {
            return h(Line, { props })
          } else if (item === 'curve') {
            return h(Curve, { props })
          // } else {
          //   return h(Text, { props })
          }
        })
        hasSpot && items.push(h(Spot, { props }))
        refLineType && items.push(h(RefLine, { props }))
        return items
      })()),
      h('div', {
        style: textStyles,
        'class': 'sparkline-text',
        ref: 'sparklineText'
      }, text)
    ])
  }
}
