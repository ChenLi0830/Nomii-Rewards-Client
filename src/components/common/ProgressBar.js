import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import Dash from 'react-native-dash';
const checkedImage = require("../../../public/images/circle-1 check.png");
const emptyImage = require("../../../public/images/circle-empty-highlight 2.png");
const percent5Image = require("../../../public/images/big-five-percent.png");
const percent10Image = require("../../../public/images/big-ten-percent.png");

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
    color: "#35ABBD",
    fontWeight: "bold"
    // position: "absolute",
    // marginLeft: width * 0.05
  },
  lineBase: {
    borderTopWidth: 3,
    borderColor: "#35ABBD",
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
    backgroundColor: "#35ABBD",
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
  if (isInvalid) return <View style={{width: width * 0.2, marginLeft: width*0.05}}>
    <Text style={styles.anchor}>
      view restrictions
    </Text>
  </View>;
  else return <View style={styles.row2WhiteSpace}/>;
};

const renderLine = (position, index) => {
  const lineStyle = position === 0 ? styles.lineHalf : styles.lineFull;
  if (index >= position)
    return <View style={[styles.lineBase, lineStyle]}/>;
  else
    return <Dash dashGap={3} dashThickness={3} dashColor="rgba(53,171,189,0.2)" style={lineStyle}/>;
};

const ProgressBar = ({index, expireAt}) => {
  const ImageSources = [
    index === 0 ? emptyImage : checkedImage,
    index === 0 && emptyImage || index === 1 && percent5Image || index === 2 && checkedImage,
    index > 1 ? percent10Image : emptyImage,
  ];
  
  const opacity = [
    {opacity: 1},
    {opacity: index >= 1 ? 1 : 0.2},
    {opacity: index >= 2 ? 1 : 0.2},
  ];
  
  const textColor = [
    {color: index === 0 ? "#35ABBD" : "rgba(53,171,189,0.2)"},
    {color: index === 1 ? "#35ABBD" : "rgba(53,171,189,0.2)"},
    {color: index === 2 ? "#35ABBD" : "rgba(53,171,189,0.2)"},
  ];
  
  const daysLeft = Math.ceil((expireAt - new Date())/(1000 * 3600 * 24));
  const expirationText = daysLeft > 1 ? `${daysLeft} days left` : `${daysLeft} day left`;
  const expirationIsInvalid = isNaN(daysLeft) || daysLeft < 0;
  
  //The elements on the right hand side takes 0.1*3 + 0.05 + 0.1*2 = 0.55
  return <View style={{flex: 1}}>
    <View style={styles.row1}>
      <View style={[styles.detailBox, expirationIsInvalid && styles.detailBoxInvalid]}>
        <Text style={[styles.detailText, expirationIsInvalid && styles.detailTextInvalid]}>{expirationText}</Text>
      </View>
      
      {renderLine(0, index)}
      
      <Image style={[styles.dots, opacity[0]]}
             source={ImageSources[0]}
             resizeMode={Image.resizeMode.contain}/>
      
      {renderLine(1, index)}
      
      <Image style={[styles.dots, opacity[1]]}
             source={ImageSources[1]}
             resizeMode={Image.resizeMode.contain}/>
      
      {renderLine(2, index)}
      
      <Image style={[styles.dots, opacity[2]]}
             source={ImageSources[2]}
             resizeMode={Image.resizeMode.contain}/>
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