import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import { FontAwesome } from '@expo/vector-icons';


const numberColWidth = responsiveWidth(4);

const styles = new StyleSheet.create({
  wrapper: {
    marginTop: 74,
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  image:{
    width: responsiveWidth(50),
  },
  title: {
    color: "#7F8C8D",
    fontSize: responsiveFontSize(2.8),
    fontWeight: "bold",
  },
  text:{
    textAlign:"center",
  },
  bold: {
    fontWeight: "600"
  },
  configView: {
    backgroundColor: "#F0F0F0",
    borderRadius: 7,
    overflow: "hidden",
    width: responsiveWidth(90),
    padding: responsiveWidth(8),
    // alignItems: "center",
  },
  configRow:{
    flexDirection: "row",
    marginTop: responsiveHeight(2.5),
  },
  numberCol: {
    width: numberColWidth,
    // backgroundColor:"yellow",
  },
  textCol: {
    flex: 1,
    // backgroundColor:"green",
  },
  configText:{
    fontSize: responsiveFontSize(1.5),
    // lineHeight: responsiveFontSize(3),
    // textAlign: ""
  },
  configNumber:{
    color: "#A1A1A1",
    fontSize: responsiveFontSize(1.5),
    // lineHeight: responsiveFontSize(3),
  }
});

const NoLocationScreen = (props) => {
  return <View style={styles.wrapper}>
    <Image resizeMode="contain"
           style={styles.image}
           source = {require('../../public/images/Home-empty-screen-card.png')}/>
    
    <Text style={styles.title}>
      To Start Earning Rewards
    </Text>
  
    <Text style={styles.text}>
      Accept the app to use your
      {"\n"}
      <Text style={styles.bold}>location </Text>
      to offer a great selection
      {"\n"}
      of stores
      <Text style={styles.bold}> around you</Text>
    </Text>
    
    <View style={styles.configView}>
      <Text style={styles.configText}>
        To turn on Location Services for your Android device:
      </Text>
  
      <View style={{left: -numberColWidth}}>
        <View style={styles.configRow}>
          <View style={styles.numberCol}>
            <Text style={styles.configNumber}>1</Text>
          </View>
          <View style={styles.textCol}>
            <Text style={styles.configText}>
              Tap
              <Text style={styles.bold}> Settings </Text>
              >
              <Text style={styles.bold}> Apps </Text>
               >
              <Text style={styles.bold}> Nomii Rewards</Text>
              .
            </Text>
          </View>
        </View>
  
        <View style={styles.configRow}>
          <View style={styles.numberCol}>
            <Text style={styles.configNumber}>2</Text>
          </View>
          <View style={styles.textCol}>
            <Text style={styles.configText}>
              Tap
              <Text style={styles.bold}> Permissions </Text>
              and toggle
              <Text style={styles.bold}> Location</Text>
              .</Text>
          </View>
        </View>

      </View>
      
    </View>
  </View>
};

export default NoLocationScreen;