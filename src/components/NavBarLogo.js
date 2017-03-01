import React from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {Image} from 'react-native-animatable';

// const {width, height} = Dimensions.get("window");

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
  return <Image animation="slideInDown" duration={500} delay={300} style={styles.logo}
                resizeMode="contain"
                source={require("../../public/images/nomii-offers-login.png")}/>;
};

export default logo;
