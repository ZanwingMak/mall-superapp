import { defineConfig } from '@tarojs/cli';

export default defineConfig({
  projectName: 'mall-superapp',
  date: '2026-03-29',
  designWidth: 750,
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: { pxtransform: { enable: true, config: {} } }
  },
  h5: { publicPath: '/', staticDirectory: 'static' }
});
