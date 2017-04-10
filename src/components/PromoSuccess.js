import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, AsyncStorage} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  title: {
    color: '#262626',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: -responsiveHeight(10),
    width: responsiveWidth(70),
  },
  image: {
    width: responsiveWidth(50),
    height: 250,
  },
  button: {
    width: responsiveWidth(80),
    height: 40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

const images = {
  one:require('../../public/images/reward-icon-onboarding.png'),
  all:require('../../public/images/reward-icon-onboarding.png'),
  firstTime10Off: require('../../public/images/reward-icon-onboarding.png'),
};

const buttonText = {
  one:`AWESOME!`,
  all:`AWESOME!`,
  firstTime10Off: `AWESOME!`,
};

let pushToken;

class PromoSuccess extends Component {
  constructor(props){
    super(props);
  }
  async componentDidMount(){
    pushToken = await AsyncStorage.getItem("@NomiiStore:pushToken");
  }
  
  btnClick(){
    // console.log("pushToken", pushToken);
    if (!pushToken || typeof pushToken !== "string" || pushToken.length === 0) {
      Actions.askNotification();
    } else {
      Actions.home();
    }
  }
  
  render(){
    let {codeSuccessScreen, restaurantName} = this.props;
    console.log("promo success this.props", this.props);
    // console.log("location", location);
    
    let index; // index of the images and contents to be shown
    if (codeSuccessScreen) {
      index = codeSuccessScreen;
    }
    else {
      if (!restaurantName || restaurantName.length===0) index = "all";
      else index = "one";
    }
    console.log("promo success  index", index);
  
    const texts = {
      one:`SUCCESS!!\nYou unlocked 5% off at ${restaurantName} on your 1st visit`,
      all:`SUCCESS!!\nYou unlocked 5% off at all restaurants on your 1st visit`,
      firstTime10Off: `SUCCESS!!\nYou unlocked 10% off at selected restaurants on your 1st visit`,
    };
    
    return (
        <View style={styles.slide}>
          <Image resizeMode="contain"
                 style={styles.image}
                 source = {images[index]}/>
        
          <Text style={styles.title}>
            {texts[index]}
          </Text>
        
          <Button style={styles.button} type="primary" onPress={() => this.btnClick()}>{buttonText[index]}</Button>
        </View>
    )
  }
}

export default PromoSuccess;