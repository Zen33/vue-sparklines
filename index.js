import Sparkline from './components/charts/Sparkline'

Sparkline.install = Vue => {
  Vue.component(Sparkline.name, Sparkline)
}

export default Sparkline
