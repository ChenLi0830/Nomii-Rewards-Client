import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, Image} from 'react-native';
import {ProgressBar} from './ProgressBar';

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
    flex: 1,
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
    // width: width * 0.25,
    // flex:1,
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
  if (distance > 1000) return `${Math.ceil(distance/1000)} km`
  else return `${Math.ceil(distance)} m`
};

const Card = ({name, distance, logo, progress, expireAt}) => {
  return <View style={styles.box} >
    <View style={styles.storeRow}>
      <View style={styles.storeInfoColumn}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.distance}>{renderDistance(distance)}</Text>
      </View>
      <View style={styles.storeLogoColumn}>
        <Image style={styles.storeLogo} resizeMode={Image.resizeMode.cover}
               source={logo}/>
      </View>
    </View>
    
    <View style={styles.discountRow}>
      <ProgressBar index={progress} expireAt={expireAt}/>
    </View>
  </View>
};

export default Card;
