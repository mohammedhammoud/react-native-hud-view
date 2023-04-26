import { Button, StyleSheet, View, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { IconProps } from 'react-native-vector-icons/Icon';

import { HudProvider, useHudContext } from '../src';

const Examples = () => {
  const { hide, show } = useHudContext<IconProps>();

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          show({ name: 'circle-o-notch' }, { rotate: true });
          setTimeout(hide, 1000);
        }}
        title="Show rotating notch"
      />
      <Button
        onPress={() => {
          show(
            { name: 'check' },
            { backgroundColor: 'rgba(26, 188, 156, 0.9)' }
          );
          setTimeout(hide, 1000);
        }}
        title="Show success"
      />
      <Button
        onPress={() => {
          show(
            { name: 'warning' },
            { backgroundColor: 'rgba(192, 57, 43, 0.9)' }
          );
          setTimeout(hide, 1000);
        }}
        title="Show error"
      />
      <Button
        onPress={() => {
          show(
            { color: '#000000', name: 'warning' },
            {
              backgroundColor: '#e67e22',
              borderRadius: 45,
              height: 90,
              width: 90,
            }
          );
          setTimeout(hide, 1000);
        }}
        title="Show custom"
      />
    </View>
  );
};

export default function App() {
  return (
    <HudProvider IconComponent={Icon}>
      <StatusBar barStyle="dark-content" />
      <Examples />
    </HudProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
});
