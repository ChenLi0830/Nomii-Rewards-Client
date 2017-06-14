import React from 'react';
import {FlatList, ListView, ScrollView, StyleSheet, View} from 'react-native';
import {Loading, WithLoadingComponent} from '../common/index';
import {graphql} from 'react-apollo';
import {getRatingFeedbacksQuery, getRestaurantStatsQuery} from '../../graphql/restaurant';
import {getTimeInSec, categorizeFeedbacksByPeriod, getPeriodIndex} from '../api';
import {branch, compose, lifecycle, renderComponent, withHandlers, withState} from 'recompose';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';
import {Tabs} from 'antd-mobile';
import RatingProgressCard from './RatingProgressCard';
import {DashboardUserRating} from './UserFeedback';

const TabPane = Tabs.TabPane;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#f9f9f9",
  },
  periodTabBar: {
    height: responsiveHeight(6),
    backgroundColor: "white",
  },
  dateView: {
    alignItems: 'center',
    backgroundColor: "#f9f9f9",
    paddingVertical: responsiveHeight(3),
  },
  starTabBar: {
    height: responsiveHeight(7),
    borderTopColor: "#eee",
    borderTopWidth: 1,
    backgroundColor: "white",
  },
});

// categorize feedbacks into different time periods
let feedBackByTimePeriod = [[], [], [], []];

const renderStarRow = (feedback) => {
  return (
      <View style={styles.dateView}>
        <DashboardUserRating userName={feedback.userName}
                             imageURL={feedback.userPictureURL}
                             comment={feedback.comment}
                             rating={feedback.rating}
                             leftAt={feedback.createdAt}/>
      </View>
  )
};

const RatingDashboard = (props) => {
  console.log("RatingDashboard props", props);
  // props.data.restaurant.statistics
  
  let ratingFeedBacks = feedBackByTimePeriod[getPeriodIndex(props.selectedTab)];
  
  console.log("ratingFeedBacks", ratingFeedBacks);
  
  let {statistics: statisticList} = props.stats.restaurant;
  // separate feedbacks based on ratingStars
  let tabStarContents = [[], [], [], [], []];
  ratingFeedBacks.map(feedback => {
    let index = feedback.rating - 1;
    tabStarContents[index].push(feedback);
  });
  
  console.log("tabStarContents", tabStarContents);
  
  // get feedback charts
  const tabCharts = statisticList.map((statistic, i) => {
    return <View style={styles.dateView} key={i}>
      <RatingProgressCard
          progressList={tabStarContents.map(starContent => starContent.length).reverse()}
          total={tabStarContents.reduce((total, starContent) => total + starContent.length, 0)}
          rating={statisticList[getPeriodIndex(props.selectedTab)].averageRating}/>
    </View>
  });
  
  // get feedback lists
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const starDataSources = tabStarContents.map(starContent => ds.cloneWithRows(starContent));
  const tabFeedbacks = starDataSources.map(dataSource => {
    return <ListView dataSource={dataSource}
                     enableEmptySections
                     renderRow={renderStarRow}
                     style={styles.list}>
    </ListView>
  });
  
  return <View style={styles.wrapper}>
    <ScrollView style={{backgroundColor: "#f9f9f9",}}>
      <View>
        <Tabs activeKey={props.selectedTab} defaultActiveKey="week" onTabClick={props.onTabClick}
              underlineColor="#f9f9f9" barStyle={styles.periodTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable
              animated>
          <TabPane tab="Day" key="day">
            {tabCharts[0]}
          </TabPane>
          <TabPane tab="Week" key="week">
            {tabCharts[1]}
          </TabPane>
          <TabPane tab="Month" key="month">
            {tabCharts[2]}
          </TabPane>
          <TabPane tab="Year" key="year">
            {tabCharts[3]}
          </TabPane>
        </Tabs>
      </View>
      
      <View style={{height: responsiveHeight(50)}}>
        <Tabs activeKey={props.selectedTabStar} onTabClick={props.onTabStarClick}
              underlineColor="#eee" barStyle={styles.starTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable
              animated>
          <TabPane tab="5 stars" key="5">
            {tabFeedbacks[4]}
          </TabPane>
          <TabPane tab="4 stars" key="4">
            {tabFeedbacks[3]}
          </TabPane>
          <TabPane tab="3 stars" key="3">
            {tabFeedbacks[2]}
          </TabPane>
          <TabPane tab="2 stars" key="2">
            {tabFeedbacks[1]}
          </TabPane>
          <TabPane tab="1 star" key="1">
            {tabFeedbacks[0]}
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
      componentWillMount(){
        feedBackByTimePeriod = categorizeFeedbacksByPeriod(this.props.data.ratingFeedBacks)
      },
      componentDidMount() {
        Amplitude.logEvent('Restaurant stats screen shows');
      },
      componentWillUpdate(nextProps){
        console.log("this.props", this.props);
        console.log("nextProps", nextProps);
      },
    }),
)(RatingDashboard);