import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Button } from 'antd-mobile';
import {Actions} from 'react-native-router-flux'
import Playground from './animations/Playground';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  }
});

const Main = () => {
  return <View style={styles.view}>
    <Playground/>
    
    <Text>
      Nomii
    </Text>
    <Button type="primary" onPress={() => Actions.intro()}>
      Continue with facebook
    </Button>
  </View>
};

export default Main;