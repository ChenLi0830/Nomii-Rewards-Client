import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, ScrollView} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import Card from './Card';

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
    <View style={{flex:1}}>
      <ScrollView style={{marginTop: 70, flex: 1,
        //backgroundColor:"#fafafa"
      }}>
        {/*<View style={{*/}
          {/*//justifyContent: "space-between",*/}
          {/*flexDirection:"column",*/}
          {/*flex:1,*/}
          {/*backgroundColor: "red"*/}
        {/*}}>*/}
          <View style={styles.listView}>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
          </View>
          
          
         {/*</View>*/}
      </ScrollView>
      
      <View style={{justifyContent: "flex-end", paddingVertical: height*0.02}}>
        <Button style={styles.button} type="primary" onPress={() => Actions.cardList()}>ADD CARDS</Button>
      </View>
    </View>
);

const Home = (props) => {
  // return noCardsContent;
  return hasCardsContent;
};

export default Home;