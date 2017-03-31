import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform, AsyncStorage} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';

const {width,height} = Dimensions.get('window');

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
    marginTop: -height * 0.1,
    width: width * 0.7,
  },
  image: {
    width: width * 0.5,
    height: 250,
    // marginTop: - height * 0.1
  },
  button: {
    width: width * 0.8,
    height: 40,
    // marginTop: Platform.OS === "ios" ? -30 : 0,
    // bottom: Platform.OS === "ios" ? 10 : -40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

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
    const {redeemedCoupons} = this.props;
    // console.log("location", location);
    let restaurantName = redeemedCoupons[redeemedCoupons.length-1].restaurantName;
    if (!restaurantName || restaurantName.length===0) restaurantName = "all restaurants";
  
    return (
        <View style={styles.slide}>
          <Image resizeMode="contain"
                 style={styles.image}
                 source = {require('../../public/images/reward-icon-onboarding.png')}/>
        
          <Text style={styles.title}>
            SUCCESS!!
            {'\n'}
            {`You unlocked 5% off at ${restaurantName} on your 1st visit`}
          </Text>
        
          <Button style={styles.button} type="primary" onPress={() => this.btnClick()}>AWESOME!</Button>
        </View>
    )
  }
}

// const PromoSuccess = ({redeemedCoupons}) => {
//   console.log("location", location);
//   let restaurantName = redeemedCoupons[redeemedCoupons.length-1].restaurantName;
//   if (!restaurantName || restaurantName.length===0) restaurantName = "all restaurants";
//
//   return (
//       <View style={styles.slide}>
//         <Image resizeMode="contain"
//                style={styles.image}
//                source = {require('../../public/images/reward-icon-onboarding.png')}/>
//
//         <Text style={styles.title}>
//           SUCCESS!!
//           {'\n'}
//           {`You unlocked 5% off at ${restaurantName} on your 1st visit`}
//         </Text>
//
//         <Button style={styles.button} type="primary" onPress={() => redirectScreen()}>AWESOME!</Button>
//       </View>
//   )
// };

// //Container
// const mapStateToProps = (state)=>({
//   location: state.user.location,
// });
// export default connect(mapStateToProps)(PromoSuccess);
export default PromoSuccess;