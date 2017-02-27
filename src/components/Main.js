import React from 'react';
import {Text, View, StyleSheet, Image, Linking, Dimensions} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import * as Animatable from 'react-native-animatable';
// import Playground from './animations/Playground';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    width: width * 0.3,
    marginTop: 60,
  },
  slogan: {
    width: width * 0.8,
  },
  title: {
    fontSize: 25,
    fontWeight: "300",
    textAlign: "center",
    letterSpacing: 2,
  },
  image: {
    marginTop: -30,
    width: 150,
  },
  textExplain: {
    color: "#9b9b9b",
    fontWeight: "900",
    marginTop: 20,
    textAlign: "center"
  },
  textPolicy: {
    textAlign: "center",
    fontSize: 10,
    color: "#9B9B9B",
    width: Dimensions.get("window").width * 0.7,
  },
  textPolicyLink: {
    color: "#505354",
  },
});

const Main = () => {
  return <View style={styles.view}>
  
    <Animatable.Image animation="fadeInDown" duration={300} delay={100}
                      style={styles.logo}
                      resizeMode={Image.resizeMode.contain}
                      source={require('../../public/images/nomii-offers-login.png')}/>
  
    <Animatable.Image animation="bounceInDown"
                      style={styles.slogan}
                      resizeMode={Image.resizeMode.contain}
                      source={require('../../public/images/slogan.png')}/>
  
    {/*<Animatable.Text style={styles.title} animation="bounceInDown">*/}
      {/*Stamp cards that*/}
      {/*{"\n"}*/}
      {/*reward you instantly*/}
    {/*</Animatable.Text>*/}
    
    <Animatable.Image style={styles.image}
                      animation="bounceInDown"
                      delay={300}
                      resizeMode={Image.resizeMode.contain}
                      source={require('../../public/images/card-icons-onboarding.png')}/>
    
    <Animatable.View animation="fadeInUp" duration={500} delay={1000}>
      <Button onPress={() => Actions.intro()} style={{minWidth: Dimensions.get("window").width * 0.8}}>
        {"Continue with facebook".toUpperCase()}
      </Button>
      
      <Text style={styles.textExplain}>
        We don't post anything on Facebook.
      </Text>
    </Animatable.View>
    
    <Animatable.Text style={styles.textPolicy} animation="fadeInUp" duration={500} delay={1300}>
      By signing up, I agree to Nomii's
      <Text style={styles.textPolicyLink}
            onPress={() => Linking.openURL("http://nomiiapp.com")}>
        {" Terms of Service "}
      </Text>
      and
      <Text style={styles.textPolicyLink}
            onPress={() => Linking.openURL("http://nomiiapp.com")}>
            {" Privacy Policy"}
      </Text>
    </Animatable.Text>
  
  </View>
};

export default Main;