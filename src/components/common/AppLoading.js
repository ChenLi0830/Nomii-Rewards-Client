import React from 'react';
import {View, Image, StyleSheet, PixelRatio, Animated, Text, TouchableWithoutFeedback} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Animatable from 'react-native-animatable';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {compose, withHandlers, withState} from 'recompose';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#e8314a",
    alignItems: "center",
    justifyContent: "center",
  },
  image:{
    width: 192 / PixelRatio.get(),
    marginBottom: responsiveHeight(5),
  },
  text: {
    color: "#fff", fontSize: 18, backgroundColor: "rgba(0,0,0,0)",
    textAlign: "center",
  }
});

const loadingStrings = [
  "",
  "Loading...",
  "still loading...",
  "seriously?",
  "wtf",
  "frak me",
  "i give up\ncheck your network",
];

let transformPath = new Animated.ValueXY();

const AppLoading = (props) => {
  let animatedStyle = {
    escapingLogo: {
      transform: [
        {translateX: transformPath.x},
        {translateY: transformPath.y},
      ]
    }
  };
  
  return <View style={styles.wrapper}>
    <View style={[StyleSheet.absoluteFill, {justifyContent: "center", marginTop: responsiveHeight(15)}]}>
      <Text style={[styles.text]}>{loadingStrings[props.strIndex]}</Text>
    </View>
    
    <TouchableWithoutFeedback onPress={props.onLogoPress}>
      <Animated.View style={animatedStyle.escapingLogo}>
        <Animatable.Image style={styles.image}
               animation="pulse" easing="ease-in" iterationCount="infinite" duration={600}
               delay={300}
               resizeMode="contain"
               source={require('../../../public/images/round-corner-app-icon_192.png')}/>
      </Animated.View>
    </TouchableWithoutFeedback>
  </View>
};

const Container = compose(
    withState('strIndex', 'updateIndex', 0),
    withHandlers({
      onLogoPress: props => () => {
        console.log("onLogoPress");
        let randomX = (Math.random() - 0.5) * responsiveWidth(80);
        let randomY = (Math.random() - 0.5) * responsiveHeight(80);
        console.log("randomX, randomY", randomX, randomY);
        Animated.timing(transformPath, {
          toValue: {x: randomX, y: randomY},
          duration: 300,
          // easing: Easing.out(Easing.quad),
        }).start();
  
        props.updateIndex(props.strIndex < 5 ? props.strIndex+1 : props.strIndex);
      }
    }),
)(AppLoading);

export {
  Container as AppLoading
}