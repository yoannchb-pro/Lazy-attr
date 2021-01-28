import babel from '@rollup/plugin-babel';
 
const config = {
  input: './src/js/lazy-attr.js',
  output: {
    dir: './dist',
    format: 'umd'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
};
 
export default config;