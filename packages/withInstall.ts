import type { App, Plugin } from 'vue'

export const withInstall = <T>(comp: T) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = comp as any

  c.install = (app: App, name?: string) => {
    app.component(name || c.componentName || c.name, comp)
  }

  return comp as T & Plugin
}
