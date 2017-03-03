import React from 'react';
import {StyleSheet, Text, ScrollView, Dimensions, View, TouchableOpacity} from 'react-native';
import Card from './common/Card';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {homeActions} from '../modules';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollList:{
    marginTop: 74,
    flex: 1,
  },
  listView: {
    paddingTop: 10,
    paddingBottom: height * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    // flex: 0.8,
    // backgroundColor: "yellow"
  },
  
});

const CardList = (props) => {
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
    },
    {
      name: "Blossom Teas SFU",
      distance: 3212,
      logo: require("../../public/images/temp/blossom-teas.png"),
      progress: 2,
      expireAt: new Date().getTime() + 1000 * 3600 * 24 * 3,
    },
    {
      name: "India Gate",
      distance: 632,
      logo: require("../../public/images/temp/india-gate.png"),
      progress: 2,
    },
    {
      name: "Russet Shack",
      distance: 18,
      logo: require("../../public/images/temp/russet-shack.png"),
      progress: 0,
    },
    {
      name: "Viet Sub",
      distance: 2112,
      logo: require("../../public/images/temp/viet-sub.png"),
      progress: 2,
    },
  ];
  
  const cards = cardContentList.map(card =>
      <TouchableOpacity TouchableOpacity style={{paddingHorizontal: 10}}
                        key={card.name} onPress={()=> props.pressCard(card)}>
        <Card {...card} />
      </TouchableOpacity>
  );
  
  
  return <View style={{flex: 1}}>
    <ScrollView style={styles.scrollList}>
      <View style={styles.listView}>
        {cards}
      </View>
    </ScrollView>
    
  </View>
};

// Container

const mapDispatchToProps = (dispatch)=>{
  return {
    pressCard: (card) => dispatch(homeActions.pressCard(card))
  }
};

export default connect(null, mapDispatchToProps)(CardList);