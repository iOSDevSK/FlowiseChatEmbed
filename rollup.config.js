import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import typescript from '@rollup/plugin-typescript';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
//import serve from "rollup-plugin-serve";
//import livereload from "rollup-plugin-livereload";

const extensions = ['.ts', '.tsx'];
const isDev = process.env.BUILD === 'development';

const baseConfig = {
  plugins: [
    resolve({ extensions, browser: true }),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['solid', '@babel/preset-typescript'],
      extensions,
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()],
      extract: false,
      modules: false,
      autoModules: false,
      minimize: !isDev,
      inject: false,
    }),
    typescript(),
    typescriptPaths({ preserveExtensions: true }),
  ],
};

if (!isDev) {
  baseConfig.plugins.push(
    uglify(),
    terser({ output: { comments: false } })
  );
}

const configs = [
  {
    ...baseConfig,
    input: './src/web.ts',
    output: {
      file: 'dist/web.js',
      format: 'es',
      sourcemap: isDev,
    },
  },
];

export default configs;