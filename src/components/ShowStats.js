import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions, ScrollView} from 'react-native';
import {Button} from './common';
import {Actions} from 'react-native-router-flux';
import {Tabs} from 'antd-mobile';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../graphql/restaurant';
import EmployeePINItem from './EmployeePINItem';
import {getTimeInSec} from './api';

const TabPane = Tabs.TabPane;


const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 74,
    // paddingVertical: height * 0.1,
    // backgroundColor: "yellow",
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
    width: width,
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
    width: width * 0.4,
    // marginTop: -height * 0.1
  },
  button: {
    marginTop: 20,
    // width: width * 0.8,
    // height: 40,
    // // marginTop: Platform.OS === "ios" ? -30 : 0,
    // bottom: Platform.OS === "ios" ? 0 : -40,
    // alignSelf: "center",
    // borderWidth: 0,
    // marginBottom: 30,
  },
  tabListView: {
    width: width,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
    marginVertical: height > 600 ? 10 : 0,
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
  assignPINView2:{
    marginBottom: height * 0.02,
    justifyContent: "space-around",
    flex:1.5,
    alignItems: "center",
    // backgroundColor: "yellow",
  },
  statsView: {
    marginTop: 20,
  },
  introView:{
    justifyContent: "center",
    flex:1,
    alignItems: "center",
    // backgroundColor: "green",
    // marginTop: 0,
  },
  text:{
    textAlign: "center",
    fontSize: 18,
    color: "#808080",
    // fontWeight:
  }
});

const renderHasPINs = (props) => {
  const {PINs, statistics, id} = props.data.restaurant;
  
  const PINList = PINs.map(PIN => {
    return <EmployeePINItem key={PIN.code} restaurantId={id} {...PIN}/>
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
                onPress={() => Actions.assignPin({restaurant: props.data.restaurant})}>
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
              onPress={() => Actions.assignPin({restaurant: props.data.restaurant})}>
        ADD NEW PIN
      </Button>
    </View>
  </View>
};

const ShowStats = (props) => {
  if (props.data.loading) return <View></View>
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
const ShowStatsWithGraphQL = graphql(getRestaurantStatsQuery, {
  options: (ownProps) => ({
    variables: {
      restaurantId: ownProps.ownedRestaurant,
      daysToCover: 30,
      endTo: getTimeInSec()
    }
  })
})(ShowStats);

export default ShowStatsWithGraphQL;