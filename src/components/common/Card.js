import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {ProgressBar} from './ProgressBar';
import {getCardUrgency, getExpireInDays, cardIsExpired} from '../api';
import {compose, withHandlers} from 'recompose';
import {connect} from 'react-redux';
import {appActions} from '../../modules';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';
import {Actions} from 'react-native-router-flux';

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
  storeLogoColumn: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center"
  },
  storeLogo: {
    width: responsiveWidth(20),
    flex: 1,
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
    distance = (distance / 1000).toFixed(1);
    unit = "km";
  }
  
  return `${distance}${unit}`
};

const Card = (props) => {
  let {id, stampCount, lastStampAt, restaurant, distance, canPress = true} = props;
  let {name, imageURL, longitude, latitude, stampValidDays} = restaurant;
  
  if (cardIsExpired(props)) {
    stampCount = 0;
  }
  let expireInDays = getExpireInDays(lastStampAt, stampValidDays);
  const urgency = getCardUrgency(stampValidDays, expireInDays);
  
  return <TouchableOpacity activeOpacity={canPress ? 0.9 : 1}
                           onPress={canPress ? props.onPress : null} style={styles.box}>
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
      <ProgressBar index={stampCount} expireInDays={expireInDays} urgency={urgency}
                   discounts={props.discounts}/>
    </View>
  </TouchableOpacity>
};

// Container - put container into a separate component if you need a different onPress behaviour
export default compose(
    connect(
        null,
        {toggleModal: appActions.toggleModal},
    ),
    withHandlers({
      onPress: props => () => {
        Amplitude.logEventWithProperties("Card selected",
            {restaurant: props.restaurant, stampCount: props.stampCount});
        if (props.distance <= 150) {
          Actions.inputPin({card: props});
        } else {
          props.toggleModal();
        }
      }
    }),
)(Card);
