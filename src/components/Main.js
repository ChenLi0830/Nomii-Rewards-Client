import React from 'react';
import {Text, View, StyleSheet, Image, Linking, Dimensions} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
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
    letterSpacing: 2,
  },
  image: {
    width: 150,
  },
  textExplain: {
    color: "#9b9b9b",
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center"
  },
  textPolicy: {
    textAlign: "center",
    fontSize: 10,
    color: "#b0b3b4",
    width: Dimensions.get("window").width * 0.7,
  },
  textPolicyLink: {
    color: "#505354",
  },
});

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