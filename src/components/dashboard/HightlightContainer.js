import React from 'react';
import {View, StyleSheet} from 'react-native';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    width: responsiveWidth(90),
    marginHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: responsiveFontSize(1),
  },
});

const HightlightContainer = (props) => {
  return <View style={styles.wrapper}>
      {props.children}
    </View>
};

export default HightlightContainer;