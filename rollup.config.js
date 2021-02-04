import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve'
 
const config = {
  input: './src/js/lazy-attr.js',
  output: [
    {
      file: './dist/lazy-attr.js',
      format: 'umd'
    },
    {
      file: './dist/lazy-attr.esm.js',
      format: 'esm'
    },
    {
      file: './dist/lazy-attr.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    resolve(),
    babel({ 
      babelHelpers: 'bundled',
    })
  ] 
};
 
export default config;