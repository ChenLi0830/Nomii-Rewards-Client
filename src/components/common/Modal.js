import React from 'react';
import {Modal, TouchableOpacity, StyleSheet, Text, Image, Dimensions, View} from 'react-native';
// import {inputPinActions} from '../modules';


const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: height * 0.25,
    paddingHorizontal: width * 0.18,
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
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    // backgroundColor: "yellow",
  },
  image: {
    // flex: 1,
    // aspectRatio: (572 / 260),
    width: width * 0.55,
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
    fontSize: 20,
    fontWeight: "600",
    // flex: 1,
    // textAlign: "center",
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

const NomiiModal = ({visible, image, text, toggle}) => {
  
  return <Modal
      animationType={"slide"}
      transparent={true}
      visible={visible}
      onRequestClose={() => toggle()}
  >
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        
        <View style={styles.imageBox}>
          <Image source={image} style={styles.image} resizeMode={Image.resizeMode.contain}/>
        </View>
        
        <View style={styles.textBox}>
          <Text style={styles.text}>
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

export {NomiiModal as Modal};