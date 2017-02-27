import React from 'react';
import {Text, View, StyleSheet, TextInput, Image} from 'react-native';
import {Button} from 'antd-mobile';
import KeyboardSpacer from 'react-native-keyboard-spacer';


const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  image: {
    width: 100,
  },
  inputText: {
    height: 40,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#9f9f9f",
    borderRadius: 20,
    textAlign: "center",
    marginHorizontal: 20
  }
});

const PromoCode = ({code, loading, message, userSubmitPromo, userChangePromo, userSkipPromo}) => {
  // console.log("props", props);
  return <View style={styles.view}>
    <Text> Have a Promo Code?</Text>
    <Image resizeMode={Image.resizeMode.contain}
           source={require('../../public/images/Promocode-placeholder.png')}/>
    <TextInput
        style={styles.inputText}
        autoCorrect={false}
        autoFocus
        maxLength={6}
        autoCapitalize="characters"
        placeholder="Input Promo Code!"
        value={code}
        onChangeText={(text) => userChangePromo(text)}
    />
    {
      message.length > 0
        &&
      <Text style={{color: "red"}}>{message}</Text>
    }
    {
      code.length>0 ?
          <Button type="primary" loading={loading} onClick={() => userSubmitPromo()}>DONE</Button>
          :
          <Button type="ghost" onClick={() => userSkipPromo()}>SKIP</Button>
    }
    <KeyboardSpacer/>
  </View>
};

export default PromoCode;