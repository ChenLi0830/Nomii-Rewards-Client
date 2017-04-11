import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Dash from 'react-native-dash';
import {responsiveWidth} from 'react-native-responsive-dimensions';

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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  row2WhiteSpace: {
    width: responsiveWidth(25),
  },
  dots: {
    width: responsiveWidth(10),
    height: responsiveWidth(15),
  },
  dotText: {
    alignSelf: "center",
    fontWeight: "bold"
  },
  lineBase: {
    borderTopWidth: 3,
    height: 0
  },
  lineFull: {
    width: responsiveWidth(10),
  },
  lineHalf: {
    width: responsiveWidth(5),
  },
  detailBox: {
    height: responsiveWidth(7),
    borderRadius: 50,
    width: responsiveWidth(25),
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

const getDiscountImage = (index, discount, urgency) => {
  if (discount === undefined) discount = index * 5;
  
  switch (discount){
    case 0: return emptyImage[urgency];
    case 5: return percent5Image[urgency];
    case 10: return percent10Image[urgency];
    default: throw new Error("invalid discount");
  }
};

const ProgressBar = ({index, expireInDays, urgency, discounts}) => {
  // Card is expired
  if (expireInDays<0) {
    // shown as new card with no stamp
    urgency = 2;
    index = 0;
  }
  
  if (!discounts) discounts = [];
  let discountImage = [];
  for (let i=0; i<3; i++){
    discountImage[i] = getDiscountImage(i, discounts[i], urgency);
  }
  
  const ImageSources = [
    index === 0 ? discountImage[0] : checkedImage,
    index === 0 && discountImage[1] || index === 1 && discountImage[1] || index === 2 && checkedImage,
    discountImage[2],
    // index === 0 && emptyImage[urgency] || index === 1 && discountImage[1] || index === 2 && checkedImage,
    // index > 1 ? discountImage[2] : emptyImage[urgency],
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
  
  const urgencyBgColor = {backgroundColor: colors[urgency]};
  
  //The elements on the right hand side takes 0.1*3 + 0.05 + 0.1*2 = 0.55
  return <View style={styles.wrapper}>
    <View style={styles.row1}>
      <View style={[styles.detailBox, urgencyBgColor, expirationIsInvalid && styles.detailBoxInvalid]}>
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