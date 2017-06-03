import React from 'react';
import {Image, StyleSheet, Text, View, ScrollView, FlatList} from 'react-native';
import {Button, WithLoadingComponent} from '../common/index';
import {Actions} from 'react-native-router-flux';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import EmployeePINItem from '../EmployeePINItem';
import {getTimeInSec} from '../api';
import {compose, lifecycle, withHandlers, branch, renderComponent, withState} from 'recompose';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';
import _ from 'lodash';
import {Loading} from '../common/index';
import { Tabs, WhiteSpace } from 'antd-mobile';
import HightlightContainer from './HightlightContainer';
import RatingProgressCard from './RatingProgressCard';
import FlatListItem from '../common/FlatListItem';
const TabPane = Tabs.TabPane;
import moment from 'moment';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
  },
  periodTabBar:{
    height: responsiveHeight(6),
    backgroundColor: "white",
  },
  dateView: {
    alignItems: 'center',
    backgroundColor: "#f9f9f9",
    paddingVertical: responsiveHeight(4),
  },
  dateText:{
    fontSize: responsiveFontSize(2.8),
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: responsiveWidth(10),
    color: "rgba(0,0,0,0.7)"
  },
  statsContainerView:{
    marginTop: responsiveHeight(1),
    alignItems: 'center',
  },
  couponView:{
    height: responsiveHeight(3),
    justifyContent: "flex-start",
  },
  couponText: {
    fontSize: responsiveFontSize(2),
    color: "#bbbbbb",
    textAlign: 'center',
    // top: -18,
  },
  statsRow:{
    width: responsiveWidth(80),
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsiveWidth(2),
  },
  statsBox:{
    width: responsiveWidth(39),
    backgroundColor: "#fff",
    borderRadius: responsiveFontSize(1),
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "space-around",
    height: responsiveHeight(15),
  },
  statsTitle: {
    fontSize: responsiveFontSize(2.2),
    color: "#727a85",
    textAlign: "center",
  },
  statsNumber: {
    fontSize: responsiveFontSize(3),
    color: "#3c434c",
    // fontWeight: "600",
  },
});

const periodToNum = {
  "day": 0,
  "week": 0,
  "month": 0,
  "year": 0,
};

const MainDashboard = (props) => {
  console.log("MainDashboard props", props);
  
  if (!props.data.restaurant) {
    console.log("user doesn't own restaurant! props.restaurant", props.data.restaurant);
    return <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>User doesn't own this restaurant</Text>
    </View>
  }
  
  let {PINs, id, statistics: statisticList} = props.data.restaurant;
  
  // const tabContents = [...statisticList, ...statisticList].map((statistic,i) => {
  const tabContents = statisticList.map((statistic,i) => {
    const statsTitles = ["New\nCustomers", "Return\nCustomers", "Total\nCustomers", "Visits"];
    const statsNumbers = [20, 9, 1280, 31];
    let boxes = [];
    for (let i=0; i<2; i++){
      boxes.push(
          <View style={styles.statsRow} key={i}>
            <View style={styles.statsBox}>
              <Text style={styles.statsTitle}>
                {statsTitles[i*2]}
              </Text>
              <Text style={styles.statsNumber}>
                {statsNumbers[i*2]}
              </Text>
            </View>
            <View style={styles.statsBox}>
              <Text style={styles.statsTitle}>
                {statsTitles[i*2+1]}
              </Text>
              <Text style={styles.statsNumber}>
                {statsNumbers[i*2+1]}
              </Text>
            </View>
          </View>
      )
    }
    
    console.log("i", i);
    
    return <View style={styles.dateView} key={i}>
        <Text style={styles.dateText}>
          {i === 0 && moment().format("dddd, MMM D")}
          {i === 1 && moment().subtract(7, "days").format("MMM D") + " - " + moment().format("MMM D")}
          {i === 2 && moment().subtract(30, "days").format("MMM D") + " - " + moment().format("MMM D")}
          {i === 3 && moment().subtract(365, "days").format("ll") + " - " + moment().format("ll")}
        </Text>
      
        <View style={styles.statsContainerView}>
          {boxes}
        </View>
  
        <View style={styles.couponView}>
          <Text style={styles.couponText}>
            {`Coupons redeemed: ${statistic.couponsCount}`}
          </Text>
        </View>
      </View>
  });
  
  
  
  const listSource = [
    {key: 0, listTitle: "Ratings", onPress: ()=>Actions.ratingDash()},
    {key: 1, listTitle: "Customer Satisfaction", onPress: ()=>Actions.satisfactionDash()},
    {key: 2, listTitle: "Complaints", onPress: ()=>Actions.complaintDash()},
    {key: 3, listTitle: "Manage PINs", onPress: ()=>Actions.managePINsDash()},
  ];
  
  return <View style={styles.wrapper}>
    <ScrollView>
      <View>
        <Tabs activeKey={props.selectedTab} defaultActiveKey = "week" onTabClick={props.onTabClick} underlineColor="#f9f9f9" barStyle = {styles.periodTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable animated>
          <TabPane tab="Day" key="day">
            {tabContents[0]}
          </TabPane>
          <TabPane tab="Week" key="week">
            {tabContents[1]}
          </TabPane>
          <TabPane tab="Month" key="month">
            {tabContents[0]}
          </TabPane>
          <TabPane tab="Year" key="year">
            {tabContents[1]}
          </TabPane>
        </Tabs>
      </View>
      

      <View>
        <FlatList
            ListHeaderComponent={()=><View style={{borderTopWidth:1, borderTopColor:"#eee"}}/>}
            data={listSource}
            renderItem={({item}) => <FlatListItem onPress={item.onPress}>{item.listTitle}</FlatListItem>}
        />
      </View>
      
    </ScrollView>
  </View>
};

// Container
export default compose(
    graphql(getRestaurantStatsQuery, {
      options: (props) => {
        return {
          variables: {
            restaurantId: props.ownedRestaurant,
            daysToCoverList: [5000, 30],
            endTo: getTimeInSec()
          },
        }
      },
    }),
    WithLoadingComponent,
    withState('selectedTab', 'updateTab', 'week'),
    withHandlers({
      onTabClick: props => (key) => {
        props.updateTab(key);
      },
    }),
    lifecycle({
      componentDidMount() {
        Amplitude.logEvent('Restaurant stats screen shows');
      },
      componentWillUpdate(nextProps){
        console.log("this.props", this.props);
        console.log("nextProps", nextProps);
      },
    }),
)(MainDashboard);