import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, ScrollView} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import Card from './Card';
import {Components} from 'exponent';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // paddingTop: 30,
  },
  slide: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  listView: {
    padding: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    // flex: 0.8,
    // backgroundColor: "yellow"
  },
  title: {
    color: '#87979b',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '800',
    marginTop: -height * 0.1,
    width: width * 0.7,
  },
  image: {
    width: width * 0.6,
    height: 250,
    marginTop: height * 0.1
  },
  button: {
    width: width * 0.8,
    height: 40,
    // marginTop: Platform.OS === "ios" ? -30 : 0,
    // bottom: Platform.OS === "ios" ? 10 : -40,
    // alignSelf: "center",
    borderWidth: 0,
  },
  bottom: {
    // position:absolute
  },
  gradient:{
    position: 'absolute',
    padding: height * 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.15
  }
});

const noCardsContent = (
    <View style={styles.slide}>
      <Image resizeMode={Image.resizeMode.contain}
             style={styles.image}
             source={require('../../public/images/Home-empty-screen-card.png')}/>
      <View>
        <Text style={styles.title}>
          Your wallet seems empty.
          {'\n'}
          Add a card to start
        </Text>
        
        <Image resizeMode={Image.resizeMode.contain}
               style={{width: width * 0.2, alignSelf: "center", marginTop: 15}}
               source={require('../../public/images/down-arrow.png')}/>
      </View>
      
      <Button style={styles.button} type="primary" onPress={() => Actions.cardList()}>ADD
        CARDS</Button>
    </View>
);

const hasCardsContent = (
    <View style={{flex: 1}}>
      <ScrollView style={{
        marginTop: 70, flex: 1,
      }}>
        <View style={styles.listView}>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
        </View>
      </ScrollView>
      
      <Components.LinearGradient
          colors={['rgba(255,255,255, 0.01)', 'rgba(255,255,255, 0.7)', 'rgba(255,255,255, 1)',
            'rgba(255,255,255, 1)']}
          style={styles.gradient}>
        <Button style={styles.button} type="primary" onPress={() => Actions.cardList()}>ADD
          CARDS</Button>
      </Components.LinearGradient>
    </View>
);

const Home = (props) => {
  // return noCardsContent;
  return hasCardsContent;
};

export default Home;