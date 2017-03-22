import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Image} from 'react-native';
import {ProgressBar} from './ProgressBar';
import {getTimeInSec} from '../api';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  box: {
    marginVertical: height * 0.02,
    paddingVertical: width * 0.03,
    width: width * 0.9,
    height: 200,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "stretch",
    // overflow: "hidden",
    
    elevation: 3,
    shadowColor: "rgba(189,195,199,0.61)",
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 4,
      width: 0
    }
  },
  storeRow: {
    paddingHorizontal: width * 0.05,
    flex: 1,
    flexDirection: "row",
    // backgroundColor: "yellow",
  },
  discountRow: {
    flex: 1,
    // marginTop: 50,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    // backgroundColor:"green",
  },
  storeInfoColumn: {
    flex: 2,
    // backgroundColor:"yellow",
    justifyContent: "space-around",
  },
  storeLogoColumn:{
    flex: 1,
    // backgroundColor: "red",
    // flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  storeLogo: {
    width: width * 0.20,
    flex:1,
  },
  name: {
    fontSize: 17,
    color: "#262626"
  },
  distance: {
    fontSize: 17,
    color: "#BDC3C7",
  },
});

const renderDistance = (distance) => {
  if (distance > 10 * 1000) return `> 10km`;
  
  let unit = "m";
  if (distance > 1000) {
    distance = (distance/1000).toFixed(1);
    unit = "km";
  }
  
  return `${distance}${unit}`
};

const getUrgency = (stampValidDays, expireInDays) => {
  console.log("stampValidDays, expireInDays", stampValidDays, expireInDays);
  let urgencyArray = [
    [2, 4, 7],
    [3, 7, 14],
    [5, 15, 30],
  ];
  // Get correct row
  let row;
  for (row=0; row<urgencyArray.length; row++){
    // row is found
    if (urgencyArray[row][2]>=stampValidDays) break;
  }
  if (row === urgencyArray.length) row--;
  
  // Get urgency
  let urgency;
  for (urgency = 0; urgency<urgencyArray[row].length; urgency++){
    // urgencyLevel is found
    if (urgencyArray[row][urgency] >= expireInDays) break;
  }
  if (urgency === urgencyArray[0].length) urgency--;
  return urgency;
};

const Card = ({id, stampCount, lastStampAt, restaurant, distance}) => {
  // console.log("restaurant", restaurant);
  let {name, imageURL, longitude, latitude, stampValidDays} = restaurant;
  
  let expireInDays = Math.ceil((parseInt(lastStampAt) + stampValidDays * 24 * 3600 - getTimeInSec())/(3600 * 24));
  
  // stampValidDays = 7;
  // expireInDays = 3;
  
  const urgency = getUrgency(stampValidDays, expireInDays);
  
  return <View style={styles.box}>
    <View style={styles.storeRow}>
      <View style={styles.storeInfoColumn}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.distance}>{renderDistance(distance)}</Text>
      </View>
      <View style={styles.storeLogoColumn}>
        <Image resizeMode={Image.resizeMode.contain}
               style={styles.storeLogo}
               source={{uri: imageURL}}/>
        {/*<Image style={styles.storeLogo} resizeMode={Image.resizeMode.cover}*/}
               {/*source={[*/}
                 {/*{uri: 'https://facebook.github.io/react/img/logo_small.png', width: 38, height: 38},*/}
                 {/*{uri: 'https://facebook.github.io/react/img/logo_small_2x.png', width: 76, height: 76},*/}
                 {/*{uri: 'https://facebook.github.io/react/img/logo_og.png', width: 400, height: 400}*/}
               {/*]}/>*/}
      </View>
    </View>
    
    <View style={styles.discountRow}>
      <ProgressBar index={stampCount % 3} expireInDays={expireInDays} urgency={urgency}/>
    </View>
  </View>
};

export default Card;
