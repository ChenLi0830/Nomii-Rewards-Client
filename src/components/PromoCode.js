import React from 'react';
import {Text, View, StyleSheet, TextInput, Image, Keyboard} from 'react-native';
import {Button} from './common';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import {promoActions} from '../modules';
import {redeemCouponMutation} from '../graphql/coupon';
import {Actions} from 'react-native-router-flux';
import {graphql} from 'react-apollo';
import {Toast} from 'antd-mobile';
import {getUserQuery} from '../graphql/user';
import {compose, withHandlers, lifecycle} from 'recompose';
import {responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: responsiveHeight(10),
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#262626",
  },
  image: {
    width: responsiveWidth(40),
    height: 150,
    // height: height * 0.4,
  },
  inputBox: {
    // alignItems: "center"
  },
  inputText: {
    height: 40,
    width: responsiveWidth(80),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 7,
    textAlign: "center",
    marginHorizontal: 20,
    fontSize: 20,
  },
  messageBox: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "300",
    backgroundColor: "rgba(0,0,0,0)",
  },
  button: {
    width: responsiveWidth(90),
  }
});

const PromoCode = (props) => {
  return <View style={styles.view}>
    <Text style={styles.title}> Have a Promo Code?</Text>
    <Image style={styles.image} resizeMode="contain"
           source={require('../../public/images/Promocode-placeholder.png')}/>
    <View style={styles.inputBox}>
      <TextInput
          style={styles.inputText}
          autoCorrect={false}
          autoFocus
          maxLength={10}
          autoCapitalize="none"
          //placeholder="Promo Code"
          value={props.code}
          onChangeText={props.userChangePromo}
          underlineColorAndroid='rgba(0,0,0,0)'
      />
      {
        props.message.length > 0
        &&
        <View style={styles.messageBox}>
          <Text style={styles.message}>{props.message}</Text>
        </View>
      }
    </View>
    
    {
      props.code.length > 0 ?
          <Button type="primary" onPress={props.submitPromo}>DONE</Button>
          :
          <Button type="ghost" onPress={props.userSkipPromo}>Skip</Button>
    }
    <KeyboardSpacer/>
  </View>
};

//Container
export default compose(
    connect(
        state => ({
          code: state.promoCode.code,
          message: state.promoCode.message,
          userId: state.user.id,
          location: state.user.location,
        }),
        {
          submitPromoFailed: promoActions.submitPromoFailed,
          userChangedScreen: promoActions.userChangedScreen,
          userChangePromo: promoActions.userChangePromo,
        }
    ),
    graphql(redeemCouponMutation),
    withHandlers({
      submitPromo: props => () => {
        Toast.loading('Loading...', 0);
        // console.log("start submit");
        
        props.mutate({
          variables: {
            userId: props.userId,
            code: props.code
          },
          refetchQueries: [{query: getUserQuery, variables: {id: props.userId}}]
        })
            .then(result => {
              // console.log("redeem coupon result", result);
              Toast.hide();
              Keyboard.dismiss();

              // Calc PromoSuccess Screen content
              const redeemedCoupons = result.data.redeemPromo.redeemedCoupons;
              const redeemedCoupon = redeemedCoupons[redeemedCoupons.length-1];
              
              let codeSuccessScreen = redeemedCoupon.coupon.codeSuccessScreen;
              let restaurantName = redeemedCoupon.restaurantName;
  
              Amplitude.logEventWithProperties("Redeem coupon succeeded", {...redeemedCoupon});
              
              Actions.promoSuccess({codeSuccessScreen, restaurantName});
              props.userChangedScreen();
            })
            .catch(err => {
              Toast.hide();
              console.log("error", err);
              Amplitude.logEventWithProperties("Redeem coupon failed", {...err});
              props.submitPromoFailed(err.graphQLErrors[0].message);
            });
      },
      userSkipPromo: props => () => {
        Keyboard.dismiss();
        setTimeout(() => {
          if (props.location) Actions.home();
          else Actions.askLocation();
          props.userChangedScreen();
          Amplitude.logEvent("Skip promo code");
        },300)}
    }),
    lifecycle({
      componentDidMount() {
        Amplitude.logEvent('PromoCode screen shows');
      }
    }),
)(PromoCode);