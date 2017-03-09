import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {Button, Modal} from './common';
import {Actions} from 'react-native-router-flux';
import Card from './common/Card';
import {Components} from 'exponent';
import {homeActions} from '../modules';
import {connect} from 'react-redux';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollList:{
    marginTop: 74, flex: 1,
  },
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
    paddingTop: 10,
    paddingBottom: height * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    // flex: 0.8,
    // backgroundColor: "yellow"
  },
  title: {
    color: '#87979b',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
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
  gradient: {
    position: 'absolute',
    padding: height * 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.15
  }
});

const Home = (props) => {
  console.log(props);
  const noCardsContent = (
      <View style={styles.slide}>
        <Image resizeMode="contain"
               style={styles.image}
               source={require('../../public/images/Home-empty-screen-card.png')}/>
        <View>
          <Text style={styles.title}>
            Your wallet seems empty.
            {'\n'}
            Add a card to start
          </Text>
          
          <Image resizeMode="contain"
                 style={{width: width * 0.2, alignSelf: "center", marginTop: 15}}
                 source={require('../../public/images/down-arrow.png')}/>
        </View>
        
        <Button style={styles.button} type="primary" onPress={() => Actions.cardList()}>ADD
          CARDS</Button>
      </View>
  );
  
  const hasCardsContent = () => {
    const cardContentList = [
      {
        name: "Poké Bar SFU",
        distance: 128,
        logo: require("../../public/images/temp/Poke_Bar_Social_Blue_Post.png"),
        progress: 1,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 1,
      },
      {
        name: "Big Smoke Burger",
        distance: 87,
        logo: require("../../public/images/temp/bigsmoke.png"),
        progress: 0,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
      },
      {
        name: "Blossom Teas SFU",
        distance: 3212,
        logo: require("../../public/images/temp/blossom-teas.png"),
        progress: 2,
        expireAt: new Date().getTime() + 1000 * 3600 * 24 * 2,
      }
    ];
    
    const cards = cardContentList.map(card =>
        <TouchableOpacity style={{paddingHorizontal: 10}} key={card.name}
                          activeOpacity={0.5} onPress={()=> props.pressCard(card)}>
          <Card key={card.name} {...card} />
        </TouchableOpacity>
    );
    
    return <View style={{flex: 1}}>
      <ScrollView style={styles.scrollList}>
        <View style={styles.listView}>
          {cards}
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
  };
  
  
  return <View style={{flex: 1}}>
    <Modal visible={props.showModal}
           image={require("../../public/images/too-far-icon.png")}
           text={"YOU SEEM FAR!\nMUST BE IN STORE\nTO GET A STAMP"}
           toggle={props.toggleModal}/>
    {
      noCardsContent
      //hasCardsContent()
    }
  </View>
};

const query = gql`
{
  user(id:101){
    id,
    fbName,
    cards{
			id
      stampCount,
      lastStampAt,
      card{
        name,
        imageURL
      }
    }
  }
}
`;

const HomeWithData = graphql(query)(Home);

// Container
const mapStateToProps = (state) => {
  return {showModal: state.home.showModal}
};
const mapDispatchToProps = (dispatch)=>{
  return {
    toggleModal: () => dispatch(homeActions.toggleModal()),
    pressCard: (card) => dispatch(homeActions.pressCard(card))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWithData);