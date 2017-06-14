import React from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import { Tabs, WhiteSpace, SwipeAction } from 'antd-mobile';
import {removePINMutation} from '../graphql/PIN';
import {graphql} from 'react-apollo';
import {Toast} from 'antd-mobile';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {compose, withHandlers} from 'recompose';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  textWrapper: {
    height: 73,
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: "white",
    borderBottomWidth:1,
    borderBottomColor: "#ECF0F1",
    paddingHorizontal: responsiveWidth(5),
  },
  userInfo:{
    flex: 2,
    // backgroundColor: "yellow",
    flexDirection: "row",
  },
  PINView:{
    flex: 1,
    // backgroundColor: "green",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 20,
  },
  userTextView:{
    marginLeft: responsiveWidth(2),
    // flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  name:{
    color: "rgba(0,0,0,0.6)",
    fontWeight: "600",
    fontSize: 18,
  },
  PINCount:{
    color: "#95A5A6",
    fontSize: 18,
  },
  prefixPIN: {
    // color: "#95A5A6",
    color: "#95A5A6",
    fontSize: 24,
  },
  PINCode: {
    color: "#262626",
    fontSize: 24,
    // fontWeight: "600",
  },
  avatar:{
    backgroundColor: "#bdc3e0",
    // backgroundColor: "rgba(225,32,89,0.9)",
    width: 48,
    borderRadius: 30,
    height: 48,
    margin: 10,
    justifyContent: "center",
  },
  nameAbbrev:{
    backgroundColor: "rgba(0,0,0,0)",
    color: "white",
    fontSize: 18,
    alignSelf: "center",
  }
});

const EmployeePIN = (props) => {
  const {code, employeeName, usageCount, mutate, restaurantId, data} = props;
  // console.log("EmployeePIN props", props);
  console.log("code, employeeName, usageCount restaurantId", code, employeeName, usageCount, restaurantId);
  const nameInitial = props.calcInitials(employeeName);
  
  const swipeButtons = [
    {
      text: 'edit',
      onPress: () => props.editPINAlert(restaurantId, employeeName, code),
      style: { backgroundColor: '#d1d1d1', color: 'white' },
    },
    {
      text: 'delete',
      onPress: () => props.removePINAlert(restaurantId, code),
      style: { backgroundColor: '#E12059', color: 'white' },
    },
  ];
  
  return <SwipeAction autoClose right={swipeButtons}>
      <View style={styles.textWrapper}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style = {styles.nameAbbrev}>{nameInitial}</Text>
          </View>
          <View style={styles.userTextView}>
            <Text style = {styles.name}>{employeeName}</Text>
            <Text style={styles.PINCount}>{`${usageCount} ${usageCount > 1 ? "times" : "time"} used`}</Text>
          </View>
        </View>
        <View style = {styles.PINView}>
          <Text>
            <Text style={styles.prefixPIN}>#</Text>
            <Text style={styles.PINCode}>{code}</Text>
          </Text>
        </View>
      
      </View>
    </SwipeAction>
};

export default compose(
    graphql(removePINMutation),
    withHandlers({
      calcInitials: props => (employeeName) => {
        employeeName = employeeName.toUpperCase();
        let abbrev = "";
        const names = employeeName.split(" ");
        if (names.length <= 3){
          // Use initial if names < 3
          names.forEach(name => abbrev += name[0])
        } else {
          // Use just first letter otherwise
          abbrev = names[0][0];
        }
        return abbrev;
      },
      removePIN: props => (restaurantId, code) => {
        Toast.loading('Deleting...', 0);
        props.mutate({
          variables: {
            restaurantId: restaurantId,
            PIN: code,
          }
        })
            .then(result => {
              Toast.hide();
            })
            .catch(error => {
              // console.log("error", error);
              Toast.fail("Something is wrong\nPlease try again", 2);
            })
      }
    }),
    withHandlers({
      removePINAlert: props => (restaurantId, code) => {
        Alert.alert(
            'Unassign Employee',
            'Are you sure you want to remove this employee?',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'Remove', onPress: () => props.removePIN(restaurantId, code), style: 'destructive'},
            ],
            { cancelable: false }
        )
      },
      editPINAlert: props => (restaurantId, employeeName, code) => {
        console.log("editPINAlert employeeName code", employeeName, code);
        Alert.alert(
            'Edit Employee',
            'Are you sure you want to edit this employee?',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'Edit', onPress: () => Actions.editPIN({oldEmployeeName: employeeName, oldPIN: code}), style: 'destructive'},
            ],
            { cancelable: false }
        )
      }
    }),
)(EmployeePIN);