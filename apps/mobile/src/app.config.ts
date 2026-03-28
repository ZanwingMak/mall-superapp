import { defineAppConfig } from '@tarojs/taro';

export default defineAppConfig({
  pages: ['pages/index/index'],
  window: {
    navigationBarTitleText: 'Mall SuperApp',
    navigationBarBackgroundColor: '#ffffff'
  }
});
