import React from 'react';
import {Image, Text, FlatList, ScrollView, Animated, TextInput, StyleSheet, View, TouchableOpacity} from 'react-native';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import {compose, lifecycle, withHandlers, withState, branch, renderComponent} from 'recompose';
import EmployeePINItem from '../EmployeePINItem';
import {getTimeInSec} from '../api';
import {Amplitude} from 'expo';
import {Button, WithLoadingComponent} from '../common';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {createPinActions} from '../../modules';
import {Tabs} from 'antd-mobile';
const TabPane = Tabs.TabPane;


const itemStyles = StyleSheet.create({
  wrapper: {
    width: responsiveWidth(90),
    height: responsiveHeight(8),
    marginBottom: responsiveHeight(1),
    flexDirection: "row",
    borderRadius: responsiveFontSize(1),
    borderWidth: 1,
    borderColor: "#f2f2f2",
    backgroundColor: "#fff",
  },
  leftCol:{
    width: responsiveWidth(45),
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: responsiveWidth(4),
  },
  rightCol:{
    width: responsiveWidth(22),
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: "rgba(0,0,0,0.7)",
    fontSize: responsiveFontSize(2.2),
    fontWeight: "300",
  },
  number: {
    color: "rgba(0,0,0,0.5)",
    fontSize: responsiveFontSize(2.5),
    fontWeight: "600",
  },
});
const CustomerSatisfactionItem = (props) => {
  const curNumberColor = props.curValue >= props.preValue ? "#89E894" : "#FF6962";
  
  return <View style={itemStyles.wrapper}>
    <View style={itemStyles.leftCol}>
      <Text style={itemStyles.name}>{props.name}</Text>
    </View>
    <View style={itemStyles.rightCol}>
      <Text style={itemStyles.number}>{props.preValue}</Text>
    </View>
    <View style={itemStyles.rightCol}>
      <Text style={[itemStyles.number, {color: curNumberColor}]}>{props.curValue}</Text>
    </View>
  </View>
};

const listStyle = StyleSheet.create({
  wrapper: {
    width: responsiveWidth(90),
    alignSelf: "center",
    justifyContent: "center",
  },
  leftCol:{
    width: responsiveWidth(45),
  },
  timeRowView: {
    flexDirection: "row",
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  rightCol:{
    width: responsiveWidth(22),
    alignItems: "center",
    justifyContent: "center",
  },
  timePeriodText: {
    fontWeight: "600",
    fontSize: responsiveFontSize(2),
    color: "rgba(0,0,0,0.7)",
  },
  listView: {
    alignItems: "center",
  },
});

const CustomerList = (props) => {
  let prevPeriod, curPeriod;
  
  switch (props.activeKey){
    case "day": prevPeriod = "Yesterday"; curPeriod = "Today"; break;
    case "week": prevPeriod = "Last week"; curPeriod = "This week"; break;
    case "month": prevPeriod = "Last month"; curPeriod = "This month"; break;
    case "year": prevPeriod = "Last year"; curPeriod = "This year"; break;
  }
  
  const itemList = props.data.map(item =>
      <CustomerSatisfactionItem key = {item.name}
                                name = {item.name}
                                preValue = {item.preValue}
                                curValue = {item.curValue}/>
  );
  
  return <View style={listStyle.wrapper}>
    <View style={listStyle.timeRowView}>
      <View style={listStyle.leftCol}/>
      <View style={listStyle.rightCol}>
        <Text style={listStyle.timePeriodText}>{prevPeriod}</Text>
      </View>
      <View style={listStyle.rightCol}>
        <Text style={listStyle.timePeriodText}>{curPeriod}</Text>
      </View>
    </View>
    
    <View style={listStyle.listView}>
      {itemList}
    </View>
  </View>
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#f9f9f9",
  },
  periodTabBar:{
    height: responsiveHeight(6),
    backgroundColor: "white",
  },
});

const CustomerSatisfaction = (props) => {
  const testData = [
    {name: "Service Speed", preValue: 82, curValue: 84},
    {name: "Service Attitude", preValue: 78, curValue: 80},
    {name: "Order Accuracy", preValue: 78, curValue: 74},
    {name: "Cleanliness", preValue: 75, curValue: 75},
    {name: "Food", preValue: 89, curValue: 92},
    {name: "Price", preValue: 86, curValue: 84},
  ];
  const tabContents = [
      <CustomerList activeKey={props.selectedTab} data = {testData}/>
  ];
  
  return <View style={styles.wrapper}>
    <Tabs activeKey={props.selectedTab} defaultActiveKey = "week" onTabClick={props.updateTab} underlineColor="#f9f9f9" barStyle = {styles.periodTabBar}
          activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable animated>
      <TabPane tab="Day" key="day">
        {tabContents[0]}
      </TabPane>
      <TabPane tab="Week" key="week">
        {tabContents[0]}
      </TabPane>
      <TabPane tab="Month" key="month">
        {tabContents[0]}
      </TabPane>
      <TabPane tab="Year" key="year">
        {tabContents[0]}
      </TabPane>
    </Tabs>
  </View>
};

export default compose(
    // graphql(getRestaurantStatsQuery, {
    //   options: (props) => {
    //     return {
    //       variables: {
    //         restaurantId: props.ownedRestaurant,
    //         daysToCoverList: [5000, 30],
    //         endTo: getTimeInSec()
    //       },
    //     }
    //   },
    // }),
    WithLoadingComponent,
    withState('selectedTab', 'updateTab', 'day'),
    withHandlers({
    }),
    lifecycle({
    }),
)(CustomerSatisfaction);