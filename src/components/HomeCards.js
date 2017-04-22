import React from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import {Button, Modal, WithLoadingComponent} from './common';
import {Actions} from 'react-native-router-flux';
import Card from './common/Card';
import {LinearGradient, Amplitude} from 'expo';
import {homeActions} from '../modules';
import {connect} from 'react-redux';
import {getUserQuery} from '../graphql/user';
import {graphql} from 'react-apollo';
import {compose, branch, withHandlers, renderComponent, pure, lifecycle} from 'recompose';
import {
  sortCardsByDistance,
  sortCardsByUrgency,
  cardIsExpired,
  getCardUrgency,
  addDistanceToCards,
  getExpireInDays
} from './api';
import NoLocationScreen from './NoLocationScreen'; // android and ios versions
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import _ from 'lodash';

const styles = StyleSheet.create({
  scrollList: {
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
    paddingBottom: responsiveHeight(15),
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
    marginTop: -responsiveHeight(10),
    width: responsiveWidth(90),
  },
  image: {
    width: responsiveWidth(60),
    height: 250,
    marginTop: responsiveHeight(10),
  },
  button: {
    height: 40,
    marginTop: 15,
    borderWidth: 0,
  },
  buttonHasContent: {
    width: responsiveWidth(80),
    height: 40,
    borderWidth: 0,
  },
  bottom: {
    // position:absolute
  },
  gradient: {
    position: 'absolute',
    padding: responsiveHeight(10),
    left: 0,
    right: 0,
    bottom: 0,
    height: responsiveHeight(15)
  },
  downArrow: {
    width: responsiveWidth(20),
    alignSelf: "center",
    marginTop: 25
  }
});

const noCardsContent = props => {
  return <View style={styles.slide}>
    <Image resizeMode="contain"
           style={styles.image}
           source={require('../../public/images/Home-empty-screen-card.png')}/>
    <View>
      <Text style={styles.title}>
        Your wallet seems empty.
        {'\n'}
        Add a card to start
      </Text>
    </View>
    
    <View>
      <Image resizeMode="contain"
             style={styles.downArrow}
             source={require('../../public/images/down-arrow.png')}/>
      
      <Button style={styles.button} type="primary" onPress={props.NavToCardList}>ADD
        CARDS</Button>
    </View>
  </View>
};

// Get cards that are not expired and have at least 1 stamp
const getValidCards = (props) => {
  // console.log("props.data", props.data);
  let userCards = [];
  if (props.data.user && props.data.user.cards && props.data.user.cards.length > 0) {
    userCards = props.data.user.cards.filter(card => {
      // Valid cards which are not expired
      return card.lastStampAt !== null && !cardIsExpired(card);
    })
  }
  // console.log("userCards", userCards);
  return userCards;
};

// Sort cards based on urgency and distance
const sortCards = (visibleCards, userLocation) => {
  
  //Add urgency to cards
  let cardsWithUrgency = visibleCards.map(card => {
    const {lastStampAt} = card;
    const stampValidDays = card.restaurant.stampValidDays;
    const expireInDays = getExpireInDays(lastStampAt, stampValidDays);
    return {...card, urgency: getCardUrgency(stampValidDays, expireInDays), expireInDays}
  });
  
  //Add distance to cards
  cardsWithUrgency = addDistanceToCards(cardsWithUrgency, userLocation);
  
  let urgentCards = _.filter(cardsWithUrgency, {urgency: 0});
  let nonUrgentCards = _.filter(cardsWithUrgency, card => card.urgency !== 0);
  
  return [...sortCardsByUrgency(urgentCards), ...sortCardsByDistance(nonUrgentCards)];
};

const hasCardsContent = (props, visibleCards) => {
  let sortedCards = sortCards(visibleCards, props.location);
  // console.log("sortedCards", sortedCards);
  
  const cards = sortedCards.map(card =>
      <View style={{paddingHorizontal: 10}} key={card.id}>
        <Card {...card} />
      </View>
  );
  
  return <View style={{flex: 1}}>
    <ScrollView style={styles.scrollList}>
      <View style={styles.listView}>
        {cards}
      </View>
    </ScrollView>
    
    <LinearGradient
        colors={['rgba(255,255,255, 0.01)', 'rgba(255,255,255, 0.7)', 'rgba(255,255,255, 1)',
          'rgba(255,255,255, 1)']}
        style={styles.gradient}>
      <Button style={styles.buttonHasContent} type="primary" onPress={props.NavToCardList}>ADD
        CARDS</Button>
    </LinearGradient>
  </View>
};

const HomeCards = (props) => {
  // console.log("HomeCards props", props);
  // console.log("props.locationGranted", props.location);
  
  const visibleCards = getValidCards(props);
  
  return <View style={{flex: 1}}>
    <Modal visible={props.showModal}
           image={require("../../public/images/too-far-icon.png")}
           text={"YOU SEEM FAR!\nMUST BE IN STORE\nTO GET A STAMP"}
           textStyle={{color: "#FF0033"}}
           toggle={props.toggleModal}/>
    {
      visibleCards.length > 0 ?
          hasCardsContent(props, visibleCards)
          :
          noCardsContent(props)
    }
  </View>
};

// Container
export default compose(
    connect(
        (state) => ({
          showModal: state.home.showModal,
          userId: state.user.id,
          location: state.user.location,
        }),
        {toggleModal: homeActions.toggleModal}
    ),
    branch(
        props => !props.location,
        renderComponent(NoLocationScreen),
    ),
    graphql(
        getUserQuery,
        {
          options: (props) => ({
            variables: {id: props.userId}
          })
        }
    ),
    WithLoadingComponent,
    withHandlers({
      NavToCardList: props => () => {
        Amplitude.logEvent("Pressed 'Add Cards' Btn");
        Actions.cardList();
      },
    }),
    lifecycle({
      componentDidMount() {
        Amplitude.logEvent('Home screen shows');
      }
    }),
    pure
)(HomeCards);