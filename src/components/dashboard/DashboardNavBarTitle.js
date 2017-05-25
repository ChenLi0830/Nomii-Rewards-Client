import React from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import {Image} from 'react-native-animatable';
import {StarRating} from '../common'

const styles = StyleSheet.create({
  wrapper: {
    height: 100,
    // flex: 1,
    alignSelf: "center",
    // top: (Platform.OS === 'ios') ? 40 : 7,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    color: "#515151",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingView:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  ratingNumber:{
    color: "#515151",
    fontSize: 28,
    fontWeight: "600",
    marginRight: 15,
  },
});

const DashboardNavBarTitle = () => {
  return <View style={styles.wrapper}>
    <Text style={styles.title}>
      The Bubble Tea Shop
    </Text>
    
    <View style = {styles.ratingView}>
      <Text style={styles.ratingNumber}>4.3</Text>
      <StarRating starColor={"#FFCC00"} emptyStarColor={"#FFCC00"}
                  disabled rating={4.3} starSize={13} starStyle = {{marginRight: 3}}/>
    </View>
  </View>
};

export default DashboardNavBarTitle;
