import React from 'react';
import {StyleSheet, View, Platform, Text} from 'react-native';
import {Image} from 'react-native-animatable';
import {StarRating} from '../common'
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
    height: 70,
    // flex: 1,
    alignSelf: "flex-start",
    // top: (Platform.OS === 'ios') ? 40 : 7,
    justifyContent: "center",
    marginLeft: responsiveWidth(3),
  },
  title: {
    textAlign: "center",
    color: "rgba(0,0,0,0.7)",
    fontSize: responsiveFontSize(4.2),
    fontWeight: "bold",
  },
});

const DashboardNavBar = ({title = "Ratings"}) => {
  return <View style={styles.wrapper}>
    <Text style={styles.title}>
      {title}
    </Text>
  </View>
};

export default DashboardNavBar;
