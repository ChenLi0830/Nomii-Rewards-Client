import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform, Image} from 'react-native';
import {ProgressBar} from './ProgressBar';
import {getTimeInSec} from '../api';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import {homeActions} from '../../modules';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  box: {
    marginVertical: responsiveHeight(2),
    paddingVertical: responsiveWidth(3),
    width: responsiveWidth(90),
    height: 200,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "stretch",
    shadowColor: "rgba(189,195,199,0.61)",
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {
      height: 4,
      width: 0
    },
    elevation: 3,
  },
  storeRow: {
    paddingHorizontal: responsiveWidth(5),
    flex: 1,
    flexDirection: "row",
  },
  discountRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  storeInfoColumn: {
    flex: 2,
    justifyContent: "space-around",
  },
  storeLogoColumn:{
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  storeLogo: {
    width: responsiveWidth(20),
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

const Card = (props) => {
  let {id, stampCount, lastStampAt, restaurant, distance} = props;
  let {name, imageURL, longitude, latitude, stampValidDays} = restaurant;
  
  let expireInDays = Math.ceil((parseInt(lastStampAt) + stampValidDays * 24 * 3600 - getTimeInSec())/(3600 * 24));
  
  const urgency = getUrgency(stampValidDays, expireInDays);
  
  return <TouchableOpacity TouchableOpacity activeOpacity={0.8}
                           onPress={props.onPress} style={styles.box}>
      <View style={styles.storeRow}>
        <View style={styles.storeInfoColumn}>
          <Text style={styles.name} numberOfLines={2}>{name}</Text>
          <Text style={styles.distance}>{renderDistance(distance)}</Text>
        </View>
        <View style={styles.storeLogoColumn}>
          <Image resizeMode={Image.resizeMode.contain}
                 style={styles.storeLogo}
                 source={{uri: imageURL}}/>
        </View>
      </View>
      
      <View style={styles.discountRow}>
        <ProgressBar index={stampCount % 3} expireInDays={expireInDays} urgency={urgency} discounts = {props.discounts}/>
      </View>
  </TouchableOpacity>
};

// Container - put container into a separate component if you need a different onPress behaviour
const mapDispatchToProps = (dispatch, props) => {
  return {
    onPress: () => dispatch(homeActions.pressCard(props))
  }
};

export default compose(
    connect(
        null,
        mapDispatchToProps,
    ),
)(Card);
