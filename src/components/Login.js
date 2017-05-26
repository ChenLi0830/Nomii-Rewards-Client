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
import {compose, lifecycle, pure, withHandlers} from 'recompose';
import {getIfPermissionAsked}from './api';

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

const Login = (props) => {
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
      <Button onPress={props.LoginAndUpsertUser} style={styles.loginBtn} type="default">
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
};

// Container
export default compose(
    connect(
        (state) => ({
          user: state.user,
        }),
        {
          updateUser: userActions.updateUser,
        }
    ),
    graphql(UpsertUserMutation),
    withHandlers({
      facebookLogin: props => async () => {
        try {
          const {type, token, expires} = await Facebook.logInWithReadPermissionsAsync(
              '1933027890253863', {// AppID To be stored securely
                permissions: ['public_profile', 'email'],
                behavior: __DEV__ ? "web" : "browser",
              });

          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            // const user = await props.upsertUser(token, expires, props);
            Toast.loading('Loading...', 0);
            await AsyncStorage.setItem("@NomiiStore:token", JSON.stringify({token, expires}));

            // login through fb
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            const {name, id, error} = await response.json();

            if (error) {
              Amplitude.logEventWithProperties("login user - fail", {error});
              return null;
            }
            else {
              Amplitude.logEvent('FB login successful');
              return {name, id, token};// result is user with token
            }
          } else {
            Amplitude.logEvent('FB login cancelled');
            Alert.alert('Log in cancelled');
          }
        }
        catch (error) {
          Alert.alert('Log in error');
          console.error(error);
          Toast.hide();
          // Error retrieving data
        }
      },
    }),
    withHandlers({
      LoginAndUpsertUser: props => async () => {
        try {
          const user = await props.facebookLogin();

          // update redux user state - legacy issue - store permissionAsked variable into redux store instead of AsyncStorage
          const notificationPermissionAsked = !!(await getIfPermissionAsked("notification")) || !!props.user.notificationPermissionAsked;
          const locationPermissionAsked = !!(await getIfPermissionAsked("location")) || !!props.user.locationPermissionAsked;
          props.updateUser({id: user.id, name: user.name, notificationPermissionAsked, locationPermissionAsked});

          // async upsertUser
          await props.mutate({
            variables: {
              id: user.id,
              fbName: user.name,
              token: user.token,
            }
          });

          Amplitude.setUserId(user.id);
        } catch (error) {
          Alert.alert('Log in error');
          console.log("LoginAndUpsertUser error", error);
        }
        
        Toast.hide();
      },
    }),
    lifecycle({
      componentDidMount(){
        Amplitude.logEvent('Login screen shows up');
      }
    }),
)(Login);