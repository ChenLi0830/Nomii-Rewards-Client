import React from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {graphql} from 'react-apollo';
import {getRatingFeedbacksQuery} from '../../graphql/restaurant';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import {
  categorizeFeedbacksByPeriod,
  categorizeFeedbacksFromPrevPeriod,
  getPeriodIndex
} from '../api';
import {WithLoadingComponent} from '../common';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';
import {Tabs} from 'antd-mobile';
const TabPane = Tabs.TabPane;

let satisInPercent = [[], [], [], []];

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
  leftCol: {
    width: responsiveWidth(45),
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: responsiveWidth(4),
  },
  rightCol: {
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
  const curNumberColor = isNaN(props.preValue) || isNaN(props.curValue) || props.curValue >= props.preValue ? "#89E894" : "#FF6962";
  
  return <View style={itemStyles.wrapper}>
    <View style={itemStyles.leftCol}>
      <Text style={itemStyles.name}>{props.name}</Text>
    </View>
    <View style={itemStyles.rightCol}>
      <Text style={itemStyles.number}>{isNaN(props.preValue) ? "N/A" : props.preValue+"%"}</Text>
    </View>
    <View style={itemStyles.rightCol}>
      <Text style={[itemStyles.number, {color: curNumberColor}]}>{isNaN(props.curValue) ? "N/A" : props.curValue+"%"}</Text>
    </View>
  </View>
};

const listStyle = StyleSheet.create({
  wrapper: {
    width: responsiveWidth(90),
    alignSelf: "center",
    justifyContent: "center",
  },
  leftCol: {
    width: responsiveWidth(45),
  },
  timeRowView: {
    flexDirection: "row",
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(2),
  },
  rightCol: {
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
  
  switch (props.activeKey) {
    case "day":
      prevPeriod = "Yesterday";
      curPeriod = "Today";
      break;
    case "week":
      prevPeriod = "Last week";
      curPeriod = "This week";
      break;
    case "month":
      prevPeriod = "Last month";
      curPeriod = "This month";
      break;
    case "year":
      prevPeriod = "Last year";
      curPeriod = "This year";
      break;
  }
  
  const itemList = props.data.map(item =>
      <CustomerSatisfactionItem key={item.name}
                                name={item.name}
                                preValue={item.preValue}
                                curValue={item.curValue}/>
  );
  
  return <ScrollView>
    <View style={listStyle.wrapper}>
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
  </ScrollView>
};

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
});

const CustomerSatisfaction = (props) => {
  let satisfactionList = satisInPercent[getPeriodIndex(props.selectedTab)];
  const tabContents = [
    <CustomerList activeKey={props.selectedTab} data={satisfactionList}/>
  ];
  
  return <View style={styles.wrapper}>
    <Tabs activeKey={props.selectedTab} defaultActiveKey="week" onTabClick={props.updateTab}
          underlineColor="#f9f9f9" barStyle={styles.periodTabBar}
          activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable
          animated>
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
    graphql(getRatingFeedbacksQuery, {
      options: (props) => {
        console.log("customer satisfaction props", props);
        return {
          variables: {
            restaurantId: props.ownedRestaurant,
            daysToCover: 730,
          },
        }
      },
    }),
    WithLoadingComponent,
    withState('selectedTab', 'updateTab', 'week'),
    withHandlers({}),
    lifecycle({
      componentWillMount(){
        let feedBackByTimePeriod = categorizeFeedbacksByPeriod(this.props.data.ratingFeedBacks);
        let feedBackFromPrevPeriod = categorizeFeedbacksFromPrevPeriod(this.props.data.ratingFeedBacks);
        for (let period of ['day', 'week', 'month', 'year']) {
          let i = getPeriodIndex(period),
              feedbackCount = feedBackByTimePeriod[i].length,
              prevFbackCount = feedBackFromPrevPeriod[i].length;
          
          let satisCount = [{
            "Food quality": feedbackCount,
            "Service attitude": feedbackCount,
            "Price": feedbackCount,
            "Restaurant cleanliness": feedbackCount,
            "Order accuracy": feedbackCount,
            "Service speed": feedbackCount,
          }, {
            "Food quality": prevFbackCount,
            "Service attitude": prevFbackCount,
            "Price": prevFbackCount,
            "Restaurant cleanliness": prevFbackCount,
            "Order accuracy": prevFbackCount,
            "Service speed": prevFbackCount,
          }];
          
          for (let feedback of feedBackByTimePeriod[i]) {
            for (let tag of feedback.tags) {
              if (tag.content) satisCount[0][tag.content] -= 1;
            }
          }
          for (let feedback of feedBackFromPrevPeriod[i]) {
            for (let tag of feedback.tags) {
              if (tag.content) satisCount[1][tag.content] -= 1;
            }
          }
          
          Object.keys(satisCount[0]).forEach(key => {
            satisInPercent[i].push({
              name: key,
              preValue: Math.round(100 * satisCount[1][key] / prevFbackCount),
              curValue: Math.round(100 * satisCount[0][key] / feedbackCount),
            });
          });
        }
        console.log("satisInPercent", satisInPercent);
      }
    }),
)(CustomerSatisfaction);