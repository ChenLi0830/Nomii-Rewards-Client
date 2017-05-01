import React from 'react';
import {Modal, TouchableOpacity, StyleSheet, Text, Image, View} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: responsiveHeight(25),
    paddingHorizontal: responsiveWidth(15),
    backgroundColor: 'rgba(185, 195, 199, 0.5)',
    // alignItems: "center",
  },
  innerContainer: {
    borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 30,
    flex: 1,
    // width: width * 0.6,
    // height: height * 0.6,
    justifyContent: "space-around"
  },
  imageBox: {
    flex:2,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    // backgroundColor: "yellow",
  },
  image: {
    // flex: 1,
    // aspectRatio: (572 / 260),
    width: responsiveWidth(60),
  },
  textBox: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 20,
    // backgroundColor: "green",
  },
  text:{
    color: "#35ABBD",
    fontSize: responsiveFontSize(2.5),
    fontWeight: "600",
    textAlign: "center",
    // textAlignVertical: "center",
  },
  footerBox: {
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    height: 50,
    // flex: 1,
    justifyContent: "center",
  },
  cancelText: {
    textAlign: "center",
    color: "#3498DB",
    fontSize: 13,
    fontWeight: "600",
  }
});

const WarnModal = ({visible, image, text, toggle, imageStyle = {}, textStyle = {}}) => {
  
  return <Modal
      animationType={"fade"}
      transparent={true}
      visible={visible}
      onRequestClose={() => toggle()}
  >
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        
        <View style={styles.imageBox}>
          <Image source={image} style={[styles.image, imageStyle]} resizeMode="contain"/>
        </View>
        
        <View style={styles.textBox}>
          <Text style={[styles.text, textStyle]}>
            {text}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.footerBox} onPress={() => toggle()}>
          <Text style={styles.cancelText}>GOT IT!</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
};

export {WarnModal as Modal};