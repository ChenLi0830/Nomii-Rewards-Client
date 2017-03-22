import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Dash from 'react-native-dash';
import { getTimeInSec } from '../api';

const checkedImage = require("../../../public/images/card-screens/1st-circle-check.png");
const emptyImage = [
  require("../../../public/images/card-screens/circle-empty-highlight-red.png"),
  require("../../../public/images/card-screens/circle-empty-highlight-orange.png"),
  require("../../../public/images/card-screens/circle-empty-highlight-teal.png"),
];
const percent5Image = [
  require("../../../public/images/card-screens/2nd-circle-5-percent-red.png"),
  require("../../../public/images/card-screens/2nd-circle-5-percent.png"),
  require("../../../public/images/card-screens/2nd-circle-5-percent-teal.png")
];
const percent10Image = [
  require("../../../public/images/card-screens/3rd-circle.png"),
  require("../../../public/images/card-screens/3rd-circle-orange.png"),
  require("../../../public/images/card-screens/3rd-circle-teal.png")
];
const colors = ["#EB2E46", "#E67E22", "#35ABBD"];
const dashColors = ["rgba(235,46,70,0.2)","rgba(230,126,34,0.2)","rgba(53,171,189,0.2)"];

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  row1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "cyan"
    // flex: 1
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-around",
    // justifyContent: "space-around",
    // backgroundColor: "green",
  },
  row2WhiteSpace: {
    width: width * 0.25,
  },
  dots: {
    width: width * 0.1,
    height: width * 0.15,
  },
  // elemBox: {
  //   alignItems: "flex-end",
  //   justifyContent: "space-around",
  // },
  dotText: {
    alignSelf: "center",
    fontWeight: "bold"
  },
  lineBase: {
    borderTopWidth: 3,
    // borderColor: "#35ABBD",
    height: 0
  },
  lineFull: {
    width: width * 0.1,
  },
  lineHalf: {
    width: width * 0.05,
  },
  detailBox: {
    height: width * 0.07,
    borderRadius: 50,
    width: width * 0.25,
    // backgroundColor: "#35ABBD",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    color: "white",
    fontWeight: "bold",
  },
  detailBoxInvalid: {
    opacity: 0.1,
  },
  detailTextInvalid:{
    opacity: 0,
  },
  anchor: {
    color: "#4A90E2",
    fontSize: 10,
    textDecorationLine: "underline",
    alignSelf:"center",
    textAlign: "center"
    // flexDirection: "column"
  }
});

const renderRestrictions = (isInvalid) => {
  return <View style={styles.row2WhiteSpace}/>;
  // if (isInvalid) return <View style={{width: width * 0.2, marginLeft: width*0.05}}>
  //   <Text style={styles.anchor}>
  //     view restrictions
  //   </Text>
  // </View>;
  // else return <View style={styles.row2WhiteSpace}/>;
};

const renderLine = (position, index, urgency) => {
  const lineStyle = position === 0 ? styles.lineHalf : styles.lineFull;
  if (index >= position)
    return <View style={[styles.lineBase, lineStyle, {borderColor: colors[urgency]}]}/>;
  else
    return <Dash dashGap={3} dashThickness={3} dashColor={dashColors[urgency]} style={[lineStyle]}/>;
};

const ProgressBar = ({index, expireInDays, urgency}) => {
  // Card is expired
  if (expireInDays<0) {
    // shown as new card with no stamp
    urgency = 2;
    index = 0;
  }
  
  const ImageSources = [
    index === 0 ? emptyImage[urgency] : checkedImage,
    index === 0 && emptyImage[urgency] || index === 1 && percent5Image[urgency] || index === 2 && checkedImage,
    index > 1 ? percent10Image[urgency] : emptyImage[urgency],
  ];
  
  const opacity = [
    {opacity: 1},
    {opacity: index >= 1 ? 1 : 0.2},
    {opacity: index >= 2 ? 1 : 0.2},
  ];
  
  const textColor = [
    {color: index === 0 ? colors[urgency] : "rgba(53,171,189,0.2)"},
    {color: index === 1 ? colors[urgency] : "rgba(53,171,189,0.2)"},
    {color: index === 2 ? colors[urgency] : "rgba(53,171,189,0.2)"},
  ];
  
  const daysLeft = expireInDays;
  const expirationText = daysLeft > 1 ? `${daysLeft} days left` : `${daysLeft} day left`;
  const expirationIsInvalid = isNaN(daysLeft) || daysLeft < 0;
  
  //The elements on the right hand side takes 0.1*3 + 0.05 + 0.1*2 = 0.55
  return <View style={{flex: 1}}>
    <View style={styles.row1}>
      <View style={[styles.detailBox, {backgroundColor: colors[urgency]}, expirationIsInvalid && styles.detailBoxInvalid]}>
        <Text style={[styles.detailText, expirationIsInvalid && styles.detailTextInvalid]}>{expirationText}</Text>
      </View>
      
      {renderLine(0, index, urgency)}
      
      <Image style={[styles.dots, opacity[0]]}
             source={ImageSources[0]}
             resizeMode="contain"/>
      
      {renderLine(1, index, urgency)}
      
      <Image style={[styles.dots, opacity[1]]}
             source={ImageSources[1]}
             resizeMode="contain"/>
      
      {renderLine(2, index, urgency)}
      
      <Image style={[styles.dots, opacity[2]]}
             source={ImageSources[2]}
             resizeMode="contain"/>
    </View>
    
    <View style={styles.row2}>
      {renderRestrictions(expirationIsInvalid)}
      <Text style={[styles.dotText, textColor[0]]}>1st visit</Text>
      <Text style={[styles.dotText, textColor[1]]}>2nd visit</Text>
      <Text style={[styles.dotText, textColor[2]]}>3rd visit</Text>
    </View>
  </View>
};

export {ProgressBar};