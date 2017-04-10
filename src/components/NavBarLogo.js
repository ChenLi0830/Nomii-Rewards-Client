import React from 'react';
import {StyleSheet, Platform} from 'react-native';
import {Image} from 'react-native-animatable';

const styles = StyleSheet.create({
  logo: {
    width: 60,
    height: 40,
    alignSelf: "center",
    flexDirection: "row",
    top: (Platform.OS === 'ios') ? 20 : 7,
  }
});

const logo = () => {
  return <Image animation="slideInDown" duration={100} delay={0} style={styles.logo}
                resizeMode="contain"
                source={require("../../public/images/nomii-offers-login.png")}/>;
};

export default logo;
