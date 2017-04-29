import React from 'react';
import {Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, WithLoadingComponent} from './common';
import {Actions} from 'react-native-router-flux';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../graphql/restaurant';
import EmployeePINItem from './EmployeePINItem';
import {getTimeInSec} from './api';
import {compose, lifecycle, withHandlers} from 'recompose';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';
import _ from 'lodash';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 74,
  },
  scrollView: {},
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
  statsTitle: {
    color: '#262626',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: "bold",
  },
  statsNumber: {
    color: '#009FE3',
    fontSize: 40,
    textAlign: 'center',
    fontWeight: "normal",
  },
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
  statsView: {
    marginTop: 20,
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

const renderHasPINs = (props) => {
  const {PINs, statistics, id} = props.data.restaurant;
  
  const PINList = PINs.map(PIN => {
    // PIN usage count within certain period
    let PINCountOverDays = _.find(statistics.PINsCount, {employeeName: PIN.employeeName});
    // If the count is available, use this number instead of PIN's total usage number
  
    return <EmployeePINItem key={PIN.code} restaurantId={id}
                            code = {PIN.code} employeeName = {PIN.employeeName}
                            usageCount={PINCountOverDays ? PINCountOverDays.count: 0}/>;
  });
  
  return <View style={styles.wrapper}>
    <ScrollView style={styles.scrollView}>
      
      <View style={styles.tabListView}>
        <View style={styles.tabView}>
          <Text style={styles.tabText}>LAST 30 DAYS</Text>
          <View style={styles.tabSelected}/>
        </View>
      </View>
  
      <View style={styles.statsView}>
        <Text style={{fontSize: 14, color: "#bbbbbb", textAlign: 'center', top: -18}}>
          {`Coupons redeemed: ${statistics.couponsCount}`}
        </Text>
        
        <Text style={styles.statsTitle}>
          New Customers
        </Text>
        
        <Text style={styles.statsNumber}>
          {statistics.newUserCount}
        </Text>
      </View>
      
      <View style={styles.statsView}>
        <Text style={styles.statsTitle}>
          Return Customers
        </Text>
        
        <Text style={styles.statsNumber}>
          {statistics.returnUserCount}
        </Text>
      </View>
      
      <View style={styles.statsView}>
        <Text style={styles.statsTitle}>
          Return Visits
        </Text>
        
        <Text style={styles.statsNumber}>
          {statistics.returnVisitCount}
        </Text>
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

const renderNoPINs = (props) => {
  return <View style={styles.wrapper}>
    
    <View style={styles.tabListView}>
      <View style={styles.tabView}>
        <Text style={styles.tabText}>LAST 30 DAYS</Text>
        <View style={styles.tabSelected}/>
      </View>
    </View>
    
    <View style={styles.introView}>
      <Image resizeMode="contain"
             style={styles.image}
             source={require('../../public/images/DEALS2.png')}/>
      
      <Text style={styles.text}>
        Check out the total
        {`\n`}
        of your monthly visits!
      </Text>
    </View>
    
    <View style={styles.assignPINView2}>
      <Text style={styles.assignPINTitle}>
        Assign PINs
      </Text>
      <Image resizeMode="contain"
             style={styles.image}
             source={require('../../public/images/PIN.png')}/>
      
      <Text style={styles.text}>
        Give your staff PIN numbers
      </Text>
      
      <Button style={styles.button} type="primary"
              onPress={props.onAddPIN}>
        ADD NEW PIN
      </Button>
    </View>
  </View>
};

const ShowStats = (props) => {
  if (!props.data.restaurant) {
    throw new Error("user doesn't own restaurant! props.data.restaurant", props.data.restaurant);
    return <View></View>
  }
  
  console.log("props.data.restaurant", props.data.restaurant);
  
  // return renderHasPINs(props);
  // return renderNoPINs(props);
  
  if (props.data.restaurant.PINs.length > 0) {
    return renderHasPINs(props);
  } else {
    return renderNoPINs(props);
  }
  
};

// Container
export default compose(
    graphql(getRestaurantStatsQuery, {
      options: (props) => {
        return {
          variables: {
            restaurantId: props.ownedRestaurant,
            daysToCover: 30,
            endTo: getTimeInSec()
          }
        }
      }
    }),
    WithLoadingComponent,
    withHandlers({
      onAddPIN: props => () => {
        Amplitude.logEvent('Add PIN btn is pressed');
        Actions.assignPin({restaurant: props.data.restaurant});
      }
    }),
    lifecycle({
      componentDidMount() {
        Amplitude.logEvent('Restaurant stats screen shows');
      }
    }),
)(ShowStats);