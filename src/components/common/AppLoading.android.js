import React from 'react';
import {PixelRatio, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#e8314a",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 192 / PixelRatio.get(),
  },
});

const AppLoading = (props) => {
  return <View style={styles.wrapper}>
    <Animatable.Image style={styles.image}
                      animation="flash" easing="ease" iterationCount="infinite" duration={4000}
                      delay={300}
                      resizeMode="contain"
                      source={require('../../../public/images/round-corner-app-icon_192.png')}/>
  </View>
};

export {
  AppLoading
}