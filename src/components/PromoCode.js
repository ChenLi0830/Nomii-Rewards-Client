import React from 'react';
import {Text, View, StyleSheet, Dimensions, TextInput, Image} from 'react-native';
import {Button} from './common';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {connect} from 'react-redux';
import {promoActions} from '../modules';
import {redeemCouponMutation} from '../graphql/coupon';
import {Actions} from 'react-native-router-flux';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {Toast} from 'antd-mobile';
import { Keyboard } from 'react-native';
import {getUserQuery} from '../graphql/user';
import {compose, withHandlers} from 'recompose';


const {width, height} = Dimensions.get("window");
const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: height * 0.1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#262626",
  },
  image: {
    width: width * 0.4,
    height: 150,
    // height: height * 0.4,
  },
  inputBox:{
    // alignItems: "center"
  },
  inputText: {
    height: 40,
    width: width * 0.8,
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
    // backgroundColor: "white",
    // height: 25,
  },
  message: {
    color: "#262626",
    fontSize: 18,
    fontWeight: "300",
    backgroundColor: "rgba(0,0,0,0)",
  },
  button: {
    width: width * 0.9,
  }
});

const PromoCode = (props) => {
  const {code, message, userChangePromo, userSkipPromo} = props;

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
          value={code}
          onChangeText={userChangePromo}
          underlineColorAndroid='rgba(0,0,0,0)'
      />
      {
        message.length > 0
        &&
        <View style={styles.messageBox}>
          <Text style={styles.message}>{message}</Text>
        </View>
      }
    </View>
    
    {
      code.length > 0 ?
          <Button type="primary" onPress={props.submitPromo}>DONE</Button>
          :
          <Button type="ghost" onPress={userSkipPromo}>Skip</Button>
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
        }),
        {
          submitPromoFailed: promoActions.submitPromoFailed,
          userChangedScreen: promoActions.userChangedScreen,
          userChangePromo: promoActions.userChangePromo,
          userSkipPromo: promoActions.userSkipPromo,
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
              console.log("redeem coupon result", result);
              Toast.hide();
              Keyboard.dismiss();
              Actions.promoSuccess({redeemedCoupons: result.data.redeemPromo.redeemedCoupons});
              props.userChangedScreen();
            })
            .catch(err => {
              Toast.hide();
              // console.log("error", err);
              props.submitPromoFailed(err.graphQLErrors[0].message);
            });
      },
    }),
)(PromoCode);