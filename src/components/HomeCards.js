import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {Button, Modal} from './common';
import {Actions} from 'react-native-router-flux';
import Card from './common/Card';
import {LinearGradient} from 'expo';
import {homeActions} from '../modules';
import {connect} from 'react-redux';
import {getUserQuery} from '../graphql/user';
import {graphql} from 'react-apollo';
import {calculateCardsWithDistances, cardIsExpired} from './api';
import NoLocationScreen from './NoLocationScreen';

const {width, height} = Dimensions.get('window');

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
    width: width * 0.9,
  },
  image: {
    width: width * 0.6,
    height: 250,
    marginTop: height * 0.1
  },
  button: {
    width: width * 0.8,
    height: 40,
    marginTop: 15,
    // marginTop: Platform.OS === "ios" ? -30 : 0,
    // bottom: Platform.OS === "ios" ? 10 : -40,
    // alignSelf: "center",
    borderWidth: 0,
  },
  buttonHasContent: {
    width: width * 0.8,
    height: 40,
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
      </View>
      
      <View>
        <Image resizeMode="contain"
               style={{width: width * 0.2, alignSelf: "center", marginTop: 25}}
               source={require('../../public/images/down-arrow.png')}/>
        
        <Button style={styles.button} type="primary" onPress={() => Actions.cardList()}>ADD
          CARDS</Button>
      </View>
    </View>
);

const getUserCards = (props) => {
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

const hasCardsContent = (props, userCards) => {
  let sortedCards = calculateCardsWithDistances(userCards, props.location);
  // console.log("sortedCards", sortedCards);
  
  const cards = sortedCards.map(card =>
      <TouchableOpacity style={{paddingHorizontal: 10}} key={card.id}
                        activeOpacity={0.5} onPress={() => props.pressCard(card)}>
        <Card {...card} />
      </TouchableOpacity>
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
      <Button style={styles.buttonHasContent} type="primary" onPress={() => Actions.cardList()}>ADD
        CARDS</Button>
    </LinearGradient>
  </View>
};

const HomeCards = (props) => {
  console.log("HomeCards props", props);
  console.log("props.locationGranted", props.location);
  if (!props.location) {
    return <NoLocationScreen/>
  }
  
  if (props.data.loading) {
    // Toast.loading('Loading...', 0);
    return <View></View>;
  }
  // Toast.hide();
  
  const userCards = getUserCards(props);
  
  return <View style={{flex: 1}}>
    <Modal visible={props.showModal}
           image={require("../../public/images/too-far-icon.png")}
           text={"YOU SEEM FAR!\nMUST BE IN STORE\nTO GET A STAMP"}
           textStyle={{color: "#FF0033"}}
           toggle={props.toggleModal}/>
    {
      userCards.length > 0 ?
          hasCardsContent(props, userCards)
          :
          noCardsContent
    }
  </View>
};

// Container

const HomeCardsWithGraphQL = graphql(getUserQuery, {
  options: (ownProps) => ({variables: {id: ownProps.userId}}),
})(HomeCards);

const mapStateToProps = (state) => {
  // console.log("state.user.id", state.user.id);
  return {
    showModal: state.home.showModal,
    userId: state.user.id,
    location: state.user.location,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModal: () => dispatch(homeActions.toggleModal()),
    pressCard: (card) => dispatch(homeActions.pressCard(card))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeCardsWithGraphQL);