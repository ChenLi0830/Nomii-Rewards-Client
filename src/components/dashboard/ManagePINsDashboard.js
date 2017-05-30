import React from 'react';
import {FlatList, ScrollView, StyleSheet, View, Text} from 'react-native';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import EmployeePINItem from '../EmployeePINItem';
import {getTimeInSec} from '../api';
import {Tabs} from 'antd-mobile';
import {Amplitude} from 'expo';
import {Button, WithLoadingComponent} from '../common';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import _ from 'lodash';
const TabPane = Tabs.TabPane;


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#f9f9f9",
  },
  assignPINView: {
    marginVertical: 40,
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
});

const ManagePINsDashboard = (props) => {
  const {PINs, id, statistics: statisticList} = props.data.restaurant;
  
  const PINList = PINs.map(PIN => {
    // PIN usage count within certain period
    const statistics = statisticList[parseInt(props.selectedTab)];
    let PINCountOverDays = _.find(statistics.PINsCount, {employeeName: PIN.employeeName});
    // If the count is available, use this number instead of PIN's total usage number
    
    return <EmployeePINItem key={PIN.code} restaurantId={id}
                            code = {PIN.code} employeeName = {PIN.employeeName}
                            usageCount={PINCountOverDays ? PINCountOverDays.count: 0}/>;
  });
  
  return <View style={styles.wrapper}>
    <ScrollView style={{backgroundColor: "#f9f9f9",}}>
      <View>
        <Tabs activeKey={props.selectedTab} onTabClick={props.onTabClick} underlineColor="#f9f9f9"
              barStyle={styles.periodTabBar}
              activeUnderlineColor="#e43c5a" activeTextColor="#e43c5a" textColor="#e43c5a" swipeable
              animated>
          <TabPane tab="Day" key="0"/>
          <TabPane tab="Week" key="1"/>
          <TabPane tab="Month" key="2"/>
          <TabPane tab="Year" key="3"/>
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
        }
      },
    }),
    WithLoadingComponent,
    withState('selectedTab', 'updateTab', '0'),
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
)(ManagePINsDashboard);