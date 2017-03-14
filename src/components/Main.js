import React, {Component} from 'react';
import {StyleSheet, Linking, Dimensions, Platform, Alert, AsyncStorage} from 'react-native';
import {Button} from './common';
import {Image, View, Text} from 'react-native-animatable';
// import Playground from './animations/Playground';
import {Actions} from 'react-native-router-flux';
import {Facebook} from 'exponent';
import {connect} from 'react-redux';
import {userActions} from '../modules';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {Toast} from 'antd-mobile';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    width: width * 0.4,
    marginTop: 60,
  },
  slogan: {
    width: width * 0.8,
  },
  // title: {
  //   color: "#D0021B",
  //   fontSize: 36,
  //   // fontWeight: "300",
  //   textAlign: "center",
  //   // letterSpacing: 2,
  // },
  image: {
    marginTop: -30,
    width: 150,
  },
  loginBtn: {
    width: Dimensions.get("window").width * 0.8,
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
    width: Dimensions.get("window").width * 0.7,
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
  
  props.updateUserId(id);
  
  const user = await props.mutate({
    variables: {
      id: id,
      fbName: name,
    }
  });
  
  Toast.hide();
  
  return user;
};

const facebookLogin = async(props) => {
  const {type, token, expires} = await Facebook.logInWithReadPermissionsAsync(
      '1933027890253863', {// AppID To be stored securely
        permissions: ['public_profile'],
        behavior: __DEV__ ? "web" : "browser",
      });
  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const upsertResult = await upsertUser(token, expires, props);
    const user = upsertResult.data.upsertUser;
  
    console.log("user", user);
    console.log("user.cards", user.cards);
    if (user.cards && user.cards.length>0) {
      console.log("Actions.main();");
      Actions.main();
    }
    else {
      console.log("Actions.intro();");
      Actions.intro();
    }
  } else {
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

class Main extends Component {
  componentDidMount() {
    (async() => { // Immediately invoked function
      // await AsyncStorage.removeItem("@NomiiStore:token");
      
      const value = await AsyncStorage.getItem("@NomiiStore:token");
      if (value !== null) {// Found token
        // console.log(value);
        const {token, expires} = JSON.parse(value);
        console.log(token, expires);
        if (new Date().getTime() < expires * 1000) {
          await upsertUser(token, expires, this.props);
          Actions.main();
        }
      }
    })()
  }
  
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
      
      {/*<Text style={styles.title} animation="bounceInDown">*/}
      {/*Stamp cards that*/}
      {/*{"\n"}*/}
      {/*reward you instantly*/}
      {/*</Text>*/}
      
      <Image style={styles.image}
             animation="bounceInDown"
             delay={300}
             resizeMode="contain"
             source={require('../../public/images/card-icons-onboarding.png')}/>
      
      <View animation="fadeInUp" duration={400} delay={600}>
        <Button onPress={() => login(this.props)} style={styles.loginBtn}>
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
;

// Container
const mutation = gql`
  mutation UpsertUser($id: ID, $fbName: String){
    upsertUser(id: $id, fbName: $fbName){
      id,
      fbName,
      cards{
        id
        stampCount,
        lastStampAt,
        card{
          name,
          imageURL,
        }
      }
    }
  }
`;

const MainWithGraphQL = graphql(mutation)(Main);

const mapDispatchToProps = (dispatch) => {
  return {
    updateUserId: (id) => dispatch(userActions.updateUserId(id))
  }
};

export default connect(null, mapDispatchToProps)(MainWithGraphQL);