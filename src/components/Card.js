import React from 'react';
import {View, Text, StyleSheet, Dimensions, Platform, Image} from 'react-native';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  box: {
    marginVertical: height * 0.02,
    width: width * 0.9,
    height: height * 0.3,
    backgroundColor: "white",
    borderRadius: 10,
    padding: width * 0.05,
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
    flex: 1,
    flexDirection: "row",
  },
  discountRow: {
    flex: 1,
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
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  storeLogo: {
    
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

const Card = (props) => {
  return <View style={styles.box}>
    <View style={styles.storeRow}>
      <View style={styles.storeInfoColumn}>
        <Text style={styles.name}>Poké Bar SFU</Text>
        <Text style={styles.distance}>1 km</Text>
      </View>
      <View style={styles.storeLogoColumn}>
        <Image style={styles.storeLogo} source={require('../../public/images/temp/Poke_Bar_Social_Blue_Post.png')}/>
      </View>
    </View>
    <View style={styles.discountRow}>
      
    </View>
  </View>
};

export default Card;
