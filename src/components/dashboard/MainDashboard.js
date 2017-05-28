import React from 'react';
import {Image, StyleSheet, Text, View, ScrollView, ListView} from 'react-native';
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
import SimpleChart from './BarChart';
const TabPane = Tabs.TabPane;


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
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
  
  
  
  
  
  
  
  assignPINTitle: {
    color: '#262626',
    fontSize: 30,
    textAlign: 'center',
    fontWeight: "bold",
  },
  PINList: {
    marginVertical: 30,
    borderTopWidth: 1,
    borderTopColor: "#ECF0F1",
    width: responsiveWidth(100),
  },
  // statsTitle: {
  //   color: '#262626',
  //   fontSize: 24,
  //   textAlign: 'center',
  //   fontWeight: "bold",
  // },
  // statsNumber: {
  //   color: '#009FE3',
  //   fontSize: 40,
  //   textAlign: 'center',
  //   fontWeight: "normal",
  // },
  image: {
    width: responsiveWidth(40),
  },
  button: {
    marginTop: 20,
  },
  tabListView: {
    width: responsiveWidth(100),
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    marginVertical: responsiveHeight(100) > 600 ? 10 : 0,
  },
  tabView: {
    // borderBottomWidth: 2,
    // borderBottomColor: "#080808",
    width: 150,
    alignItems: "center",
    height: 35,
    justifyContent: "space-between",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "300",
  },
  tabSelected: {
    width: 120,
    borderBottomWidth: 2,
    borderBottomColor: "#080808",
    bottom: -2,
  },
  assignPINView: {
    marginVertical: 40,
  },
  assignPINView2: {
    marginBottom: responsiveHeight(2),
    justifyContent: "space-around",
    flex: 1.5,
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  
  introView: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    // backgroundColor: "green",
    // marginTop: 0,
  },
  text: {
    textAlign: "center",
    fontSize: 18,
    color: "#808080",
    // fontWeight:
  }
});

const MainDashboard = (props) => {
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
  
  const PINList = PINs.map(PIN => {
    // PIN usage count within certain period
    const statistics = statisticList[parseInt(props.selectedTab)];
    let PINCountOverDays = _.find(statistics.PINsCount, {employeeName: PIN.employeeName});
    // If the count is available, use this number instead of PIN's total usage number
    
    return <EmployeePINItem key={PIN.code} restaurantId={id}
                            code = {PIN.code} employeeName = {PIN.employeeName}
                            usageCount={PINCountOverDays ? PINCountOverDays.count: 0}/>;
  });
  
  const tabContents = statisticList.map((statistic,i) => {
    
    const statsTitles = ["New\nCustomers", "Return\nCustomers", "Total\nCustomers", "Stamps"];
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
    
    return <View style={styles.dateView} key={i}>
        <Text style={styles.dateText}>
          Friday, May 12
        </Text>
      
        <View style={styles.statsContainerView}>
          {boxes}
        </View>
      </View>
  });
  
  
  return <View style={styles.wrapper}>
    <ScrollView style={styles.scrollView}>
      <View>
        <Tabs activeKey={props.selectedTab} onTabClick={props.onTabClick} barStyle = {{borderBottomColor: "#f9f9f9"}}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable animated>
          <TabPane tab="Day" key="0">
            {tabContents[0]}
          </TabPane>
          <TabPane tab="Week" key="1">
            {tabContents[1]}
          </TabPane>
          <TabPane tab="Month" key="2">
            {tabContents[1]}
          </TabPane>
          <TabPane tab="Year" key="3">
            {tabContents[1]}
          </TabPane>
        </Tabs>
      </View>
      
      
      <View style={styles.assignPINView}>
        <Text style={styles.assignPINTitle}>
          Assigned PINs
        </Text>
        
        <View style={styles.PINList}>
          {PINList}
        </View>
        
        <Button style={styles.button} type="primary"
                onPress={props.onAddPIN}>
          ADD NEW PIN
        </Button>
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
          // fetchPolicy: 'cache-and-network',
        }
      },
    }),
    WithLoadingComponent,
    withState('selectedTab', 'updateTab', '0'),
    withHandlers({
      onAddPIN: props => () => {
        Amplitude.logEvent('Add PIN btn is pressed');
        Actions.assignPin({restaurant: props.data.restaurant});
      },
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