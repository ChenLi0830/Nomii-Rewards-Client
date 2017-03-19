import React from 'react';
import {StyleSheet, Text, View, Image, Dimensions, Platform, TextInput} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {createPinActions} from '../modules';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {createPINMutation} from '../graphql/PIN';
const {width,height} = Dimensions.get('window');
import {Toast} from 'antd-mobile';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 74,
  },
  PINTitle: {
    color: '#262626',
    fontSize: 30,
    fontWeight: 'bold',
  },
  PINCode: {
    color: '#262626',
    fontSize: 35,
  },
  newPINView:{
    alignItems: "center",
  },
  inputView:{
    alignItems: "center",
  },
  inputTitle:{
    fontSize: 30,
    color: "#262626",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ECF0F1",
    width: width,
    // flex: 1,
  },
  inputText: {
    textAlign: "center",
    height: 60,
    fontSize: 25,
    color: "#585858",
  },
  button: {
    // marginTop: Platform.OS === "ios" ? -30 : 0,
    // bottom: Platform.OS === "ios" ? 0 : -40,
  }
});

const createNewPIN = (props) => {
  Toast.loading('Creating...', 0);
  props.mutate({variables: {
    restaurantId: props.restaurant.id,
    PIN: props.pin,
    employeeName: props.employeeName,
  }})
      .then(result=>{
        Toast.hide();
      })
      .then(()=>{
        Actions.pop();
      })
      .then(()=>{
        setTimeout(()=>props.createEmployeeSuccess(), 1500);
      })
      .catch(error => {
        // console.log("error", error);
        Toast.fail("Something is wrong\nPlease try again", 2);
      })
};
    
const AssignPIN = (props) => {
  const {generateNewPin, pin, employeeName, changeEmployeeName, restaurant, mutate, createEmployeeSuccess} = props;
  // console.log("AssignPIN props restaurantId, pin, employeeName", restaurantId, pin, employeeName);
  generateNewPin(restaurant.PINs);
  
  return (
      <View style={styles.wrapper}>
        
        <View style = {styles.newPINView}>
          <Text style={styles.PINTitle}>
            New PIN
          </Text>
    
          <Text style={styles.PINCode}>
            #{pin}
          </Text>
        </View>
        
        <View style={styles.inputView}>
          <Text style={styles.inputTitle}>
            Enter Employee Name:
          </Text>
  
          <View style = {styles.inputBox}>
            <TextInput style={styles.inputText} autoCorrect={false}
                       value={employeeName} onChangeText={(text) => changeEmployeeName(text)}
                       underlineColorAndroid='rgba(0,0,0,0)'>
            </TextInput>
          </View>
        </View>
        
        <Button style={styles.button} type="primary"
                onPress={() => createNewPIN(props)}>
          Create
        </Button>
  
        <KeyboardSpacer />
      </View>
  )
};

//Container

const AssignPINWithGraphQL = graphql(createPINMutation)(AssignPIN);

const mapStateToProps = (state) => ({
  pin: state.createPIN.pin,
  employeeName: state.createPIN.employeeName,
});

const mapDispatchToProps = (dispatch) => ({
  generateNewPin: (restaurantPINs) => dispatch(createPinActions.generateNewPin(restaurantPINs)),
  changeEmployeeName: (name) => dispatch(createPinActions.changeEmployeeName(name)),
  createEmployeeSuccess: () => dispatch(createPinActions.createEmployeeSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssignPINWithGraphQL);