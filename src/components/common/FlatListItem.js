import React from 'react';
import {StyleSheet, TouchableHighlight, TouchableOpacity, Text, View} from 'react-native';
import {Entypo} from '@expo/vector-icons';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions'

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth:1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    height: responsiveHeight(7),
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: responsiveWidth(10),
    paddingRight: responsiveWidth(6),
    marginTop: -1, // offset the border between two items
  },
  text:{
    fontSize: responsiveFontSize(2.2),
    color: "#E12059"
  },
});

const FlatListItem = (props) => {
  return <TouchableHighlight onPress={props.onPress} underlayColor="#eee">
    <View style={styles.wrapper}>
      <Text style={styles.text}>
        {props.children}
      </Text>

      <Entypo name="chevron-thin-right" size={responsiveFontSize(2.8)} color="#DADADA"/>
    </View>
  </TouchableHighlight>
};

export default FlatListItem;