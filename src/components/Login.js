import React, {Component} from 'react';
import {StyleSheet, Linking, Platform, Alert, AsyncStorage} from 'react-native';
import {Button} from './common';
import {Image, View, Text} from 'react-native-animatable';
import {Amplitude, Facebook} from 'expo';
import {connect} from 'react-redux';
import {userActions} from '../modules';
import {UpsertUserMutation} from '../graphql/user';
import {graphql} from 'react-apollo';
import {Toast} from 'antd-mobile';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {compose, lifecycle, pure} from 'recompose';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    width: responsiveWidth(40),
    marginTop: 60,
  },
  slogan: {
    width: responsiveWidth(80),
  },
  image: {
    marginTop: -30,
    width: 150,
  },
  loginBtn: {
    height: 40,
    marginTop: Platform.OS === "ios" ? -30 : 0,
  },
  textExplain: {
    color: "#9b9b9b",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center"
  },
  textPolicy: {
    textAlign: "center",
    fontSize: 13,
    color: "#9b9b9b",
    width: responsiveWidth(70),
    marginBottom: 20,
  },
  textPolicyLink: {
    color: "#505354",
  },
});

const upsertUser = async(token, expires, props) => {
  Toast.loading('Loading...', 0);
  await AsyncStorage.setItem("@NomiiStore:token", JSON.stringify({token, expires}));
  
  const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
  
  const {name, id} = await response.json();
  
  const userResult = await props.mutate({
    variables: {
      id: id,
      fbName: name,
      token: token,
    }
  });
  
  const user = userResult.data.upsertUser;
  
  props.updateUser(user);
  // console.log("user", user);
  
  Toast.hide();
  return user;
};

const facebookLogin = async(props) => {
  const {type, token, expires} = await Facebook.logInWithReadPermissionsAsync(
      '1933027890253863', {// AppID To be stored securely
        permissions: ['public_profile', 'email'],
        behavior: __DEV__ ? "web" : "browser",
      });
  
  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const user = await upsertUser(token, expires, props);
    await Amplitude.setUserId(user.id);
    Amplitude.logEvent('FB login successful');
    
  } else {
    Amplitude.logEvent('FB login cancelled');
    Alert.alert('Log in cancelled');
  }
};

const login = async(props) => {
  try {
    await facebookLogin(props);
  }
  catch (error) {
    console.error(error);
    // Error retrieving data
  }
};

class Login extends Component {
  render() {
    return <View style={styles.view}>
      
      <Image animation="fadeInDown" duration={200} delay={100}
             style={styles.logo}
             resizeMode="contain"
             source={require('../../public/images/nomii-offers-login.png')}/>
      
      <Image animation="bounceInDown"
             style={styles.slogan}
             resizeMode="contain"
             source={require('../../public/images/slogan.png')}/>
      
      <Image style={styles.image}
             animation="bounceInDown"
             delay={300}
             resizeMode="contain"
             source={require('../../public/images/card-icons-onboarding.png')}/>
      
      <View animation="fadeInUp" duration={400} delay={600}>
        <Button onPress={() => login(this.props)} style={styles.loginBtn} type="default">
          {"Continue with facebook".toUpperCase()}
        </Button>
        
        <Text style={styles.textExplain}>
          We don't post anything on Facebook.
        </Text>
      </View>
      
      <Text style={styles.textPolicy} animation="fadeInUp" duration={400} delay={800}>
        By signing up, I agree to Nomii's
        <Text style={styles.textPolicyLink}
              onPress={() => Linking.openURL("http://nomiiapp.com")}>
          {" Terms of Service "}
        </Text>
        and
        <Text style={styles.textPolicyLink}
              onPress={() => Linking.openURL("https://www.iubenda.com/privacy-policy/7826140")}>
          {" Privacy Policy"}
        </Text>
      </Text>
    
    </View>
  }
}

// Container
export default compose(
    connect(
        null,
        {
          updateUser: userActions.updateUser,
        }
    ),
    graphql(UpsertUserMutation),
    lifecycle({
      componentDidMount(){
        Amplitude.logEvent('Login screen shows up');
      }
    }),
)(Login);