import { defaultLineStyle, defaultFillStyle } from '../constant'
import type { CSSProperties } from 'vue'

const useStyles = (styles: CSSProperties) => {
  const {
    stroke,
    strokeWidth,
    strokeLinejoin,
    strokeLinecap,
    fillOpacity,
    fill
  } = styles
  
  return {
    lineStyle: {
      stroke: stroke ?? defaultLineStyle.stroke,
      strokeWidth: strokeWidth ?? defaultLineStyle.strokeWidth,
      strokeLinejoin: strokeLinejoin ?? defaultLineStyle.strokeLinejoin,
      strokeLinecap: strokeLinecap ?? defaultLineStyle.strokeLinecap,
      fill: 'none'
    },
    fillStyle: {
      stroke: stroke ?? defaultFillStyle.stroke,
      strokeWidth: 0,
      fillOpacity : fillOpacity ?? defaultFillStyle.fillOpacity,
      fill: fill ?? defaultFillStyle.fill
    }
  }
}

export default useStyles
