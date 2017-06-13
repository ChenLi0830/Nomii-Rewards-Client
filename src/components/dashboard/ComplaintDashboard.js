import React from 'react';
import {FlatList, ListView, ScrollView, StyleSheet, View} from 'react-native';
import {WithLoadingComponent} from '../common/index';
import {graphql} from 'react-apollo';
import {getRatingFeedbacksQuery} from '../../graphql/restaurant';
import {categorizeFeedbacksByPeriod, getPeriodIndex, getTimeInSec} from '../api';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';
import {Tabs} from 'antd-mobile';
import ComplaintBarChart from './ComplaintBarChart';
import {DashboardUserComplaint} from './UserFeedback';
import moment from 'moment';


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

const renderFeedbackRow = (feedback) => {
  return <View style={styles.dateView}>
    <DashboardUserComplaint userName={feedback.userName}
                            imageURL={feedback.userPictureURL}
                            comment={feedback.comment}
                            rating={feedback.rating}
                            leftAt={feedback.createdAt}
                            isResolved={feedback.isResolved}
                            contactInfo = {feedback.userContact}
                            tags = {feedback.tags.map(tag => tag.content)}/>
  </View>
};

// categorize feedbacks into different time periods
let feedBackByTimePeriod = [[], [], [], []];
let tabCharts;

const ComplaintDashboard = (props) => {
  console.log("ComplaintDashboard props", props);
  console.log("feedBackByTimePeriod", feedBackByTimePeriod);
  
  let ratingFeedBacks = feedBackByTimePeriod[getPeriodIndex(props.selectedTab)];
  
  console.log("ratingFeedBacks", ratingFeedBacks);
  
  // separate feedbacks based on resolved or not
  let tabFeedbackList = [[], [], [], [], []];
  ratingFeedBacks.map(feedback => {
    let index = feedback.isResolved ? 1 : 0;
    tabFeedbackList[index].push(feedback);
  });
  
  // get feedback lists
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const feedbackDataSources = tabFeedbackList.map(starContent => ds.cloneWithRows(starContent));
  const tabFeedbacks = feedbackDataSources.map(dataSource => {
    return <ListView dataSource={dataSource}
                     enableEmptySections
                     renderRow={renderFeedbackRow}
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
        <Tabs activeKey={props.selectedTabResolve} onTabClick={props.onTabResolveClick}
              underlineColor="#eee" barStyle={styles.starTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable
              animated>
          <TabPane tab="Unresolved" key="unresolved">
            {tabFeedbacks[0]}
          </TabPane>
          <TabPane tab="Resolved" key="resolved">
            {tabFeedbacks[1]}
          </TabPane>
        </Tabs>
      </View>
    
    </ScrollView>
  </View>
};

// Container
export default compose(
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
      componentWillMount(){
        // get complaints from all ratingFeedbacks
        let complaints = this.props.data.ratingFeedBacks.filter(feedback => {
          return feedback.userContact && typeof feedback.userContact === "string" && feedback.userContact.length > 0
        });
        
        feedBackByTimePeriod = categorizeFeedbacksByPeriod(complaints);
        let numOfCols = [6, 7, 4, 12];
        let nowTimeStamp = getTimeInSec();
        let dayInSec = 24 * 3600;
        let feedbackCountByPeriod = [[], [], [], []];
        let feedbackColNameByPeriod = [[], [], [], []];
        let colFormat = ['HH a', 'ddd', 'MMMM Do', 'MMM'];
        let chartDataList = [[], [], [], []];
        
        let startOfPeriod = [nowTimeStamp - dayInSec, nowTimeStamp - 7 * dayInSec,
          nowTimeStamp - 30 * dayInSec, nowTimeStamp - 365 * dayInSec];
        feedBackByTimePeriod.forEach((feedbacks, i) => {
          let spanInSec = (nowTimeStamp - startOfPeriod[i]) / numOfCols[i];
          
          feedbacks.forEach(feedback => {
            let colIndex = Math.trunc((feedback.createdAt - startOfPeriod[i]) / spanInSec);
            feedbackCountByPeriod[i][colIndex] = ~~feedbackCountByPeriod[i][colIndex] + 1;
          });
          
          for (let k = 0; k < numOfCols[i]; k++) {
            if (i === 1 || i === 3) {//week or year
              feedbackColNameByPeriod[i][numOfCols[i] - k - 1] =
                  moment().subtract(spanInSec * k, "seconds").format(colFormat[i]);
            }
            else if (i === 0) {// day
              const start = moment().subtract(spanInSec * (k + 1) - 3600, "seconds")
                  .format(colFormat[i]);
              const end = moment().subtract(spanInSec * k, "seconds").format(colFormat[i]);
              feedbackColNameByPeriod[i][numOfCols[i] - k - 1] = start + " - " + end;
            }
            else {// Month
              const start = moment().subtract(spanInSec * (k + 1) - 3600 * 24, "seconds")
                  .format(colFormat[i]);
              const end = moment().subtract(spanInSec * k, "seconds").format(colFormat[i]);
              feedbackColNameByPeriod[i][numOfCols[i] - k - 1] = start + "-" + end;
            }
          }
          
          for (let k = 0; k < numOfCols[i]; k++) {
            chartDataList[i][k] = [feedbackColNameByPeriod[i][k], feedbackCountByPeriod[i][k]];
          }
        });
        
        tabCharts = chartDataList.map((chartData, i) => {
          return <View style={styles.dateView} key={i}>
            <ComplaintBarChart data={chartData}/>
          </View>
        });
      },
      
      componentDidMount() {
        Amplitude.logEvent('Restaurant stats screen shows');
      },
      componentWillUpdate(nextProps){
        console.log("this.props", this.props);
        console.log("nextProps", nextProps);
      },
    }),
)(ComplaintDashboard);