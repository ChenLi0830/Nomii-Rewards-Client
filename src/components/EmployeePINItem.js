import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Tabs, WhiteSpace, SwipeAction } from 'antd-mobile';
import {removePINMutation} from '../graphql/PIN';
import {graphql} from 'react-apollo';
import {Toast} from 'antd-mobile';

const styles = StyleSheet.create({
  textWrapper: {
    height: 73,
    flexDirection: "row",
    justifyContent: 'space-between',
    backgroundColor: "white",
    borderBottomWidth:1,
    borderBottomColor: "#ECF0F1",
    // alignItems: 'center',
    // paddingVertical: height * 0.1,
  },
  userInfo:{
    flex: 1,
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
    // flexDirection: "column",
    justifyContent: "center"
  },
  name:{
    color: "#95A5A6",
    fontWeight: "600",
    fontSize: 18,
  },
  PINCount:{
    color: "#009FE3",
    fontSize: 18,
  },
  prefixPIN: {
    color: "#95A5A6",
    fontSize: 24,
  },
  PINCode: {
    color: "#262626",
    fontSize: 24,
    // fontWeight: "600",
  },
  avatar:{
    backgroundColor: "#D8D8D8",
    width: 48,
    borderRadius: 30,
    height: 48,
    margin: 10,
    justifyContent: "center"
  },
  nameAbbrev:{
    backgroundColor: "rgba(0,0,0,0)",
    color: "white",
    fontSize: 18,
    alignSelf: "center",
  }
});

const calcInitials = (employeeName) => {
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
};

const removePIN = (mutate, restaurantId, code, data) => {
  Toast.loading('Deleting...', 0);
  const variables = {
    restaurantId: restaurantId,
    PIN: code,
  };
  mutate({variables: {...variables}})
      .then(result => {
        Toast.hide();
      });
};

const EmployeePIN = ({code, employeeName, usageCount, mutate, restaurantId, data}) => {
  // console.log("EmployeePIN props", props);
  console.log("code, employeeName, usageCount restaurantId", code, employeeName, usageCount, restaurantId);
  const nameInitial = calcInitials(employeeName);
  
  return <View style={{flex: 1}}>
    <SwipeAction
        autoClose
        right={[
          {
            text: 'delete',
            onPress: () => removePIN(mutate, restaurantId, code, data),
            style: { backgroundColor: '#F50000', color: 'white' },
          },
        ]}
        onOpen={() => console.log('global open')}
        onClose={() => console.log('global close')}
    >
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
  </View>
};



export default graphql(removePINMutation)(EmployeePIN);