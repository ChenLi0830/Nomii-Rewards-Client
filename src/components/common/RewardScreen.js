import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform} from 'react-native';
import {Button} from './Button';
import {Actions} from 'react-native-router-flux';

const {width,height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.1,
  },
  title: {
    color: '#6EB8C0',
    fontSize: 45,
    textAlign: 'center',
    fontWeight: '300',
    marginVertical: -height * 0.05,
  },
  image: {
    width: width * 0.5,
    // marginTop: - height * 0.1
  },
  detailText:{
    color: '#95A5A6',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '500',
    width: width * 0.9,
  },
  button: {
    width: width * 0.8,
    height: 40,
    marginTop: Platform.OS === "ios" ? -30 : 0,
    bottom: Platform.OS === "ios" ? 10 : -40,
    alignSelf: "center",
    borderWidth: 0,
  }
});

const images = [
  require('../../../public/images/big-check.png'),
  require('../../../public/images/big-five-percent.png'),
  require('../../../public/images/big-ten-percent.png'),
];

const titles = [
  "Noiceee!",
  "Littt!",
  "Radical!",
];

const detailText = [
  "Thanks for the visit!\nGet 5% on your next visit!",
  "5% off your total\nGet 10% on your next visit!",
  "10% off your total!\nYou’re a warrior for completing the card!"
];

const buttonTitles = [
  "AWESOME!",
  "SWEET!",
  "AWESOME!"
];

const RewardScreen = (props) => {
  const index = props.progress;
  
  return (
      <View style={styles.slide}>
        <Image resizeMode={Image.resizeMode.contain}
               style={styles.image}
               source = {images[index]}/>
        
        <Text style={styles.title}>
          {titles[index]}
        </Text>
  
        <Text style={styles.detailText}>
          {detailText[index]}
        </Text>
        
        <Button style={styles.button} type="primary" onPress={() => Actions.home()}>
          {buttonTitles[index]}
        </Button>
      </View>
  )
};

export {RewardScreen};