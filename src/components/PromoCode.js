import React from 'react';
import {Text, View, StyleSheet, Dimensions, TextInput, Image} from 'react-native';
import {Button} from './common';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
    fontWeight: "800",
    color: "#262626",
  },
  image: {
    width: width * 0.4,
    height: 150,
    // height: height * 0.4,
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
  message: {
    color: "#262626",
    fontSize: 25,
    fontWeight: "300",
  },
  button: {
    width: width * 0.9,
  }
});

const PromoCode = ({code, loading, message, userSubmitPromo, userChangePromo, userSkipPromo}) => {
  console.log(width, height);
  return <View style={styles.view}>
    <Text style={styles.title}> Have a Promo Code?</Text>
    <Image style={styles.image} resizeMode={Image.resizeMode.contain}
           source={require('../../public/images/Promocode-placeholder.png')}/>
    <TextInput
        style={styles.inputText}
        autoCorrect={false}
        autoFocus
        maxLength={6}
        autoCapitalize="none"
        placeholder="Promo Code"
        value={code}
        onChangeText={(text) => userChangePromo(text)}
        underlineColorAndroid='rgba(0,0,0,0)'
    />
    {
      message.length > 0
      &&
      <Text style={styles.message}>{message}</Text>
    }
    {
      message.length === 0
      &&
      (
          code.length > 0 ?
              <Button type="primary" onPress={() => userSubmitPromo()}>DONE</Button>
              :
              <Button type="ghost" onPress={() => userSkipPromo()}>Skip</Button>
      )
    }
    <KeyboardSpacer/>
  </View>
};

export default PromoCode;