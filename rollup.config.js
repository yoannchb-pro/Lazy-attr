import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import uglify from 'rollup-plugin-uglify';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import pkg from './package.json';

const transformStyles = postcss({
  extract: 'dist/lazy-attr-animation.css',
  plugins: [autoprefixer, cssnano]
});

const input = './src/js/lazy-attr.js';

export default [
  {
    input,
    output: {
      file: pkg.browser,
      name: 'LAZY-ATTR',
      format: 'umd',
      sourcemap: process.env.NODE_ENV === 'dev'
    },
    plugins: [
      transformStyles,
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      uglify()
    ]
  },
  {
    input,
    external: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      transformStyles,
      babel({
        exclude: 'node_modules/**'
      }),
    ]
  }
];