import { View, Text, Button } from '@tarojs/components';

export default function Index() {
  return (
    <View style={{ padding: '24px' }}>
      <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Mall SuperApp</Text>
      <View style={{ marginTop: '12px' }}>
        <Text>这是 Taro 多端入口，可发布到 iOS/Android/鸿蒙/微信小程序。</Text>
      </View>
      <Button style={{ marginTop: '16px' }} type='primary'>进入商城</Button>
    </View>
  );
}
