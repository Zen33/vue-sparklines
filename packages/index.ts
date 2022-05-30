import type { App } from 'vue'
import Base from './Sparklines'
import Line from './Line'
import Bar from './Bar'
import Curve from './Curve'
import Pie from './Pie'
import Gradient from './Gradient'
import { withInstall } from './withInstall'

export const Sparklines = withInstall(Base)
export const SparklineLine = withInstall(Line)
export const SparklineBar = withInstall(Bar)
export const SparklineCurve = withInstall(Curve)
export const SparklinePie = withInstall(Pie)
export const SparklineGradient = withInstall(Gradient)

export default {
  install: (app: App) => {
    app.use(Sparklines)
    app.use(SparklineLine)
    app.use(SparklineBar)
    app.use(SparklineCurve)
    app.use(SparklinePie)
    app.use(SparklineGradient)
  },
  version: typeof PKG_VERSION === 'undefined' ? '' : PKG_VERSION, // eslint-disable-line
}
