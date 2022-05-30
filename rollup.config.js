import url from '@rollup/plugin-url'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import vue from 'rollup-plugin-vue'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import { DEFAULT_EXTENSIONS } from '@babel/core'
import multiInput from 'rollup-plugin-multi-input'
import resolve from '@rollup/plugin-node-resolve'
import filesize from 'rollup-plugin-filesize'
import dts from 'rollup-plugin-dts'
import pkg from './package.json'

const name = 'vue-sparklines'
const externalDeps = Object.keys(pkg.dependencies || {}).concat([/@babel\/runtime/])
const externalPeerDeps = Object.keys(pkg.peerDependencies || {})
const banner = `/**
 * ${name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * @license ${pkg.license}
 */
`
const input = ['packages/**/*.ts', '!packages/*.d.ts', '!packages/interface.ts']
const getPlugins = () => {
  const plugins = [
    resolve(),
    vue(),
    commonjs(),
    esbuild({
      target: 'esnext',
      minify: false,
      jsx: 'preserve',
      tsconfig: 'tsconfig.json'
    }),
    babel({
      babelHelpers: 'runtime',
      extensions: [...DEFAULT_EXTENSIONS, '.vue', '.ts', '.tsx']
    }),
    json(),
    url(),
    replace({
      preventAssignment: true,
      values: {
        PKG_VERSION: JSON.stringify(pkg.version)
      }
    }),
    filesize()
  ]

  return plugins
}
const esConfig = {
  input,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput({
    relative: 'packages/'
  })].concat(getPlugins()),
  output: {
    banner,
    dir: 'es/',
    format: 'esm',
    sourcemap: true,
    chunkFileNames: '_chunks/dep-[hash].js'
  }
}
/** @type {import('rollup').RollupOptions} */
const cjsConfig = {
  input,
  external: externalDeps.concat(externalPeerDeps),
  plugins: [multiInput({
    relative: 'packages/'
  })].concat(getPlugins()),
  output: {
    banner,
    dir: 'lib/',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    chunkFileNames: '_chunks/dep-[hash].js'
  }
}
const dtsConfig = {
  input: 'packages/index.ts',
  output: {
    banner,
    dir: 'type/'
  },
  plugins: [dts()]
}

export default [esConfig, cjsConfig, dtsConfig]
