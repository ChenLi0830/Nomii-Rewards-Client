import React from 'react';
import {Image, StyleSheet, Text, ListView, View, ScrollView, FlatList} from 'react-native';
import {Button, WithLoadingComponent} from '../common/index';
import {Actions} from 'react-native-router-flux';
import {graphql} from 'react-apollo';
import {getRatingFeedbacksQuery, getRestaurantStatsQuery} from '../../graphql/restaurant';
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
import {DashboardUserRating} from './UserFeedback';

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

const periodToNum = {
  "day": 0,
  "week": 1,
  "month": 2,
  "year": 3,
};

const renderStarRow = (feedback) => {
  return (
      <View style={styles.dateView}>
        <DashboardUserRating userName={feedback.userName}
                             imageURL={feedback.userPictureURL}
                             comment = {feedback.comment}
                             rating={feedback.rating}
                             leftAt = {feedback.createdAt}/>
      </View>
  )
};

const RatingDashboard = (props) => {
  console.log("RatingDashboard props", props);
  // props.data.restaurant.statistics
  
  const {ratingFeedBacks} = props.data;
  console.log("ratingFeedBacks", ratingFeedBacks);
  
  let {statistics: statisticList} = props.stats.restaurant;
  // separate feedbacks based on ratingStars
  let tabStarContents = [[],[],[],[],[]];
  ratingFeedBacks.map(feedback => {
    let index = feedback.rating-1;
    tabStarContents[index].push(feedback);
  });
  
  console.log("tabStarContents", tabStarContents);
  
  const tabContents = statisticList.map((statistic,i) => {
    return <View style={styles.dateView} key={i}>
      <RatingProgressCard progressList = {tabStarContents.map(starContent => starContent.length).reverse()}
                          total = {tabStarContents.reduce((total, starContent) => total + starContent.length, 0)}
                          rating = {statisticList[periodToNum[props.selectedTab]].averageRating}/>
    </View>
  });
  
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const starDataSources = tabStarContents.map(starContent => ds.cloneWithRows(starContent));
  const starListViews = starDataSources.map(dataSource => {
    return <ListView dataSource={dataSource}
                     enableEmptySections
                     renderRow={renderStarRow}
                     style={styles.list}>
    </ListView>
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
            {tabContents[2]}
          </TabPane>
          <TabPane tab="Year" key="year">
            {tabContents[3]}
          </TabPane>
        </Tabs>
      </View>
  
      <View style={{height: responsiveHeight(70)}}>
        <Tabs activeKey={props.selectedTabStar} onTabClick={props.onTabStarClick} underlineColor="#eee" barStyle = {styles.starTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable animated>
          <TabPane tab="5 stars" key="5">
            {starListViews[4]}
          </TabPane>
          <TabPane tab="4 stars" key="4">
            {starListViews[3]}
          </TabPane>
          <TabPane tab="3 stars" key="3">
            {starListViews[2]}
          </TabPane>
          <TabPane tab="2 stars" key="2">
            {starListViews[1]}
          </TabPane>
          <TabPane tab="1 star" key="1">
            {starListViews[0]}
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
            daysToCoverList: [1, 7, 30, 365],
            endTo: getTimeInSec()
          },
        }
      },
      name: "stats",
    }),
    branch(
        props => props.stats.loading || (props.stats && props.stats.loading),
        renderComponent(Loading),
    ),
    graphql(getRatingFeedbacksQuery, {
      options: (props) => {
        console.log("getRatingFeedbacksQuery props", props);
        return {
          variables: {
            restaurantId: props.ownedRestaurant,
            daysToCover: 365,
          },
        }
      },
    }),
    WithLoadingComponent,
    withState('selectedTab', 'updateTab', 'week'),
    withState('selectedTabStar', 'updateTabStar', '5'),
    withHandlers({
      onTabClick: props => (key) => {
        props.updateTab(key);
      },
      onTabStarClick: props => (key) => {
        props.updateTabStar(key);
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