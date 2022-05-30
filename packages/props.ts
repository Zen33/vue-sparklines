import type { PropType } from 'vue'
import { Point, RefLine, Tooltip } from './interface'
import uid from './utils/uid'
import { defaultSpotProps, defaultTooltipStyle } from './constant'

const baseProps = {
  width: {
    type: Number,
    default: 200
  },
  height: {
    type: Number,
    default: 60
  }
}
const childProps = {
  data: {
    type: Array as PropType<number[]>
  },
  limit: {
    type: Number,
    default: 3
  },
  margin: {
    type: Number,
    default: 3
  },
  styles: {
    type: Object,
    default: () => ({})
  },
  max: Number,
  min: Number
}
const spotPartProps = {
  points: Array as PropType<Point[]>,
  hasSpot: Boolean,
  spotlight: {
    type: [Number, Boolean],
    default: false
  },
  spotStyles: {
    type: Object,
    default: () => ({
      strokeOpacity: 0,
      fillOpacity: 0
    })
  },
  spotProps: {
    type: Object,
    default: () => (defaultSpotProps)
  }
}
const refLinePartProps = {
  points: Array as PropType<Point[]>,
  refLineType: { // 'max', 'min', 'mean', 'avg', 'median', 'custom' or false
    type: [String, Boolean],
    default: 'mean'
  },
  refLineStyles: {
    type: Object,
    default: () => ({})
  },
  refLineProps: {
    type: Object as PropType<RefLine>
  }
}

export const textProps = {
  point: Object as PropType<Point>,
  margin: {
    type: Number,
    default: 2
  },
  textStyles: {
    type: Object,
    default: () => ({
      fontSize: 12
    })
  },
  text: {
    type: String,
    default: ''
  }
}
export const sparklineProps = {
  ...baseProps,
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
      stroke: '#dd2c00'
    })
  },
  tooltipProps: {
    type: Object as PropType<Tooltip>
  },
  tooltipStyles: {
    type: Object,
    default: () => (defaultTooltipStyle)
  },
  tooltipDelay: {
    type: Number,
    default: 0
  }
}
export const pieProps = {
  ...sparklineProps,
  data: {
    type: Array as PropType<number[]>
  },
  align: {
    type: String,
    default: 'left' // 'left', 'center', 'right'
  }
}
export const refLineProps = {
  ...baseProps,
  ...childProps,
  ...spotPartProps,
  ...refLinePartProps,
  ...textProps,
  divisor: {
    type: Number,
    default: 0.5
  }
}
export const spotProps = {
  ...baseProps,
  ...childProps,
  ...spotPartProps,
  ...refLinePartProps,
  ...textProps,
  divisor: {
    type: Number,
    default: 0.5
  }
}
export const lineProps = {
  ...baseProps,
  ...childProps,
  ...spotPartProps,
  ...refLinePartProps,
  ...textProps
}
export const barProps = {
  ...baseProps,
  ...childProps,
  ...refLinePartProps
}
export const curveProps = {
  ...baseProps,
  ...childProps,
  ...spotPartProps,
  ...refLinePartProps,
  ...textProps,
  divisor: {
    type: Number,
    default: 0.5
  }
}
export const gradientProps = {
  gradient: {
    type: Array as PropType<string[]>
  },
  id: {
    type: String,
    default: uid()
  }
}
