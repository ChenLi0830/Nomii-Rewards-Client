import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import { Button } from 'antd-mobile';
import {Actions} from 'react-native-router-flux'
import * as Animatable from 'react-native-animatable';
// import Playground from './animations/Playground';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    color: "red",
    fontSize: 35,
    fontWeight: "800",
  },
  title: {
    fontSize: 25,
    fontWeight: "300",
    textAlign: "center",
  },
  image: {
    width: 200,
  },
  btnExplain:{
    color: "gray",
    fontWeight: "700",
  },
});

const AnimatableBtn = Animatable.createAnimatableComponent(Button);

const Main = () => {
  return <View style={styles.view}>
    
    <Animatable.Text animation="fadeInDown" duration={300} delay={100}>
      nomii logo
    </Animatable.Text>
    
    <Animatable.Text style={styles.title} animation="bounceInDown">
      Stamp cards that
      {"\n"}
      reward you instantly
    </Animatable.Text>
    
    <Animatable.Image style={styles.image}
                      animation="bounceInDown"
                      delay={300}
                      resizeMode={Image.resizeMode.contain}
           source={require('../../public/images/card-icons-onboarding.png')}/>
    
    
    <AnimatableBtn animation="fadeInUp" duration={300} delay={1000} type="primary" onPress={() => Actions.intro()}>
      Continue with facebook
    </AnimatableBtn>
    
    <Text style={styles.btnExplain}>
      We don't post anything on Facebook.
    </Text>
  </View>
};

export default Main;