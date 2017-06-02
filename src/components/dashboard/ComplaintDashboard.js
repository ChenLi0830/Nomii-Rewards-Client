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
import ComplaintBarChart from './ComplaintBarChart';
import HightlightContainer from './HightlightContainer';
import RatingProgressCard from './RatingProgressCard';
import FlatListItem from '../common/FlatListItem';
import {DashboardUserComplaint} from './UserFeedback';


const TabPane = Tabs.TabPane;


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
  dateView: {
    alignItems: 'center',
    backgroundColor: "#f9f9f9",
    paddingVertical: responsiveHeight(3),
  },
  starTabBar:{
    height: responsiveHeight(7),
    borderTopColor: "#eee",
    borderTopWidth: 1,
    backgroundColor: "white",
  },
});

const RatingDashboard = (props) => {
  console.log("MainDashboard props", props);
  
  if (!props.data.restaurant) {
    console.log("user doesn't own restaurant! props.restaurant", props.data.restaurant);
    return <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>User doesn't own this restaurant</Text>
    </View>
  }
  
  const {PINs, id, statistics: statisticList} = props.data.restaurant;
  statisticList[2] = statisticList[0];statisticList[3] = statisticList[1];
  
  console.log("statisticList", statisticList);
  
  const tabContents = statisticList.map((statistic,i) => {
    return <View style={styles.dateView} key={i}>
        <ComplaintBarChart/>
    </View>
  });
  
  const tabResolveContents = statisticList.map((statistic,i) => {
    const statsTitles = ["New\nCustomers", "Return\nCustomers", "Total\nCustomers", "Stamps"];
    const statsNumbers = [20, 9, 1280, 31];

    return <View style={styles.dateView} key={i}>
      <DashboardUserComplaint/>
    </View>
  });
  
  return <View style={styles.wrapper}>
    <ScrollView style={{backgroundColor: "#f9f9f9",}}>
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
            {tabContents[1]}
          </TabPane>
          <TabPane tab="Year" key="year">
            {tabContents[1]}
          </TabPane>
        </Tabs>
      </View>
  
      <View>
        <Tabs activeKey={props.selectedTabResolve} onTabClick={props.onTabResolveClick} underlineColor="#eee" barStyle = {styles.starTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable animated>
          <TabPane tab="Unresolved" key="unresolved">
            {tabResolveContents[0]}
          </TabPane>
          <TabPane tab="Resolved" key="resolved">
            {tabResolveContents[0]}
          </TabPane>
        </Tabs>
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
    withState('selectedTab', 'updateTab', 'day'),
    withState('selectedTabResolve', 'updateTabResolve', 'unresolved'),
    withHandlers({
      onTabClick: props => (key) => {
        props.updateTab(key);
      },
      onTabResolveClick: props => (key) => {
        props.updateTabResolve(key);
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
)(RatingDashboard);