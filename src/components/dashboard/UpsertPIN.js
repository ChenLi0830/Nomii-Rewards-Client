import React from 'react';
import {Image, Text, FlatList, ScrollView, Platform, Animated, TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import {compose, lifecycle, withHandlers, withState, branch, renderComponent} from 'recompose';
import {Toast} from 'antd-mobile';
import EmployeePINItem from '../EmployeePINItem';
import {getTimeInSec} from '../api';
import {Amplitude} from 'expo';
import {Button, WithLoadingComponent} from '../common';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import {createPINMutation, editPINMutation} from '../../graphql/PIN';
import {connect} from 'react-redux';
import {createPinActions} from '../../modules';
import {Tabs} from 'antd-mobile';
const TabPane = Tabs.TabPane;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#fafafa",
    paddingTop: responsiveHeight(3),
  },
  periodTabBar:{
    height: 0,
  },
  card:{
    backgroundColor: 'white',
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: responsiveFontSize(1),
    paddingVertical: responsiveHeight(3),
  },
  cardTopView: {
    paddingVertical: responsiveHeight(3),
    height: responsiveHeight(25),
    alignItems: "center",
  },
  topViewText:{
    color: "rgba(0,0,0,0.6)",
    fontSize: responsiveFontSize(2),
  },
  employeeImg:{
    width: responsiveWidth(60),
    height: responsiveHeight(20),
  },
  cardBotView: {
    backgroundColor: "#eee",
    height: responsiveHeight(7),
    width: responsiveWidth(80),
    borderRadius: responsiveFontSize(1),
    borderBottomRightRadius: responsiveFontSize(1),
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "#DDD",
  },
  botViewText:{
    fontSize: 16,
    width: responsiveWidth(80),
    color: "#333333",
    fontWeight: "bold",
    textAlign: "center",
    height: responsiveHeight(7),
  },
  button:{
  
  }
});

const UpsertPIN = (props) => {
  console.log("props", props);
  const step1 = <View style={{alignItems: "center"}}>
    <View style={styles.card}>
      <View style={styles.cardTopView}>
        <Image style={styles.employeeImg}
               resizeMode="contain"
               source={require('../../../public/images/Group.png')}/>
      </View>
      
      <View style={styles.cardBotView}>
        <TextInput
            style={styles.botViewText}
            autoFocus={true}
            onChangeText={props.changeEmployeeName}
            placeholder="Input Employee Name"
            value={props.employeeName}
            autoCorrect={false}
            autoCapitalize="words"
            underlineColorAndroid='rgba(0,0,0,0)'
            blurOnSubmit
        />
      </View>
    </View>
    
    <Button style={styles.button} type="primary2" rounded={false} shadow={false}
            disabled={props.employeeName.length <= 0} onPress={()=>props.updateStep("step2")}>
      Next
    </Button>
  </View>;
  
  const step2 = <View style={{alignItems: "center"}}>
    <View style={styles.card}>
      <View style={styles.cardTopView}>
        <Image style={styles.employeeImg}
               resizeMode="contain"
               source={require('../../../public/images/PIN.png')}/>
      </View>
      
      <View style={styles.cardBotView}>
        <TextInput
            style={styles.botViewText}
            autoFocus={true}
            onChangeText={props.changePin}
            placeholder="Assign 4-digits PIN"
            value={props.PIN}
            autoCorrect={false}
            autoCapitalize="words"
            keyboardType="numeric"
            maxLength={4}
            underlineColorAndroid='rgba(0,0,0,0)'
        />
      </View>
    </View>
    
    <Button style={styles.button} type="primary2" rounded={false} shadow={false} disabled={props.PIN.length !== 4}
            onPress={props.onSubmit}>
      Submit
    </Button>
  </View>;
  
  return <View style={styles.wrapper}>
    {
      Platform.OS === "android"
        &&
      (
          props.step === "step1" ?
          step1
          :
          step2
      )
    }
  
    {
      Platform.OS === "ios"
        &&
      <Tabs activeKey={props.step} underlineColor="#f9f9f9"
           barStyle={styles.periodTabBar}
           activeUnderlineColor="#f9f9f9" activeTextColor="#f9f9f9" swipeable animated>
        <TabPane tab="0" key="step1">
          {step1}
        </TabPane>
        <TabPane tab="1" key="step2">
          {step2}
        </TabPane>
      </Tabs>
    }
  </View>
};

export default compose(
    connect(
        state => ({
          employeeName: state.createPIN.employeeName,
          PIN: state.createPIN.pin,
        }),
        {
          changeEmployeeName: createPinActions.changeEmployeeName,
          changePin: createPinActions.changePin,
          createEmployeeSuccess: createPinActions.createEmployeeSuccess,
        },
    ),
    withState('step', 'updateStep', "step1"),
    graphql(createPINMutation, {
      name: "createPINMutation"
    }),
    graphql(editPINMutation, {
      name: "editPINMutation"
    }),
    withHandlers({
      onSubmit: props => async () => {
        try {
          const {ownedRestaurant, oldPIN, PIN, employeeName} = props;
          Toast.loading('Creating...', 0);
          
          if (props.editPIN){
            await props.editPINMutation({
              variables: {
                restaurantId: ownedRestaurant,
                oldPIN: oldPIN,
                newPIN: PIN,
                employeeName: employeeName,
              }
            });
          }
          else {
            await props.createPINMutation({
              variables: {
                restaurantId: ownedRestaurant,
                PIN: PIN,
                employeeName: employeeName,
              }
            });
          }
          Actions.pop();
        }
        catch (error){
          alert(JSON.stringify(error));
          console.log("error", error);
        }
        finally{
          Toast.hide();
        }
      },
    }),
    lifecycle({
      componentWillMount(){
        if (this.props.editPIN){
          this.props.changeEmployeeName(this.props.oldEmployeeName);
          this.props.changePin(this.props.oldPIN);
        }
        else {
          this.props.changeEmployeeName("");
          this.props.changePin("");
        }
      }
    }),
)(UpsertPIN);