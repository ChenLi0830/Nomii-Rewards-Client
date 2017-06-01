import React from 'react';
import {Image, Text, FlatList, ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import {compose, lifecycle, withHandlers, withState, branch, renderComponent} from 'recompose';
import EmployeePINItem from '../EmployeePINItem';
import {getTimeInSec} from '../api';
import {Amplitude} from 'expo';
import {Button, WithLoadingComponent} from '../common';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import _ from 'lodash';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#fafafa",
  },
  assignPINView: {
    marginVertical: 20,
  },
  PINList: {
    marginBottom: 30,
    width: responsiveWidth(100),
  },
});

const noPINStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#fafafa",
    paddingTop: responsiveHeight(3),
  },
  card:{
    backgroundColor: 'white',
    width: responsiveWidth(90),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: responsiveFontSize(1),
  },
  cardTopView: {
    paddingVertical: responsiveHeight(3),
    height: responsiveHeight(25),
    alignItems: "center",
  },
  topViewText:{
    color: "rgba(0,0,0,0.6)",
    fontSize: responsiveFontSize(2),
  },
  employeeImg:{
    width: responsiveWidth(45),
    height: responsiveHeight(16),
  },
  cardBotView: {
    backgroundColor: "rgba(225,32,89,0.9)",
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    borderBottomLeftRadius: responsiveFontSize(1),
    borderBottomRightRadius: responsiveFontSize(1),
    alignItems: "center",
    justifyContent: "center",
  },
  botViewText:{
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
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
                            code={PIN.code} employeeName={PIN.employeeName}
                            usageCount={PINCountOverDays ? PINCountOverDays.count : 0}/>;
  });
  
  return <View style={styles.wrapper}>
    <ScrollView style={{backgroundColor: "#fafafa",}}>
      <View style={styles.PINList}>
        {PINList}
      </View>
      
      <Button type="primary2" rounded={false} shadow={false}
              onPress={props.onAddPIN}>
        Create PIN
      </Button>
    </ScrollView>
  </View>
};

const noPINsDashboard = (props) => {
  return <View style={noPINStyles.wrapper}>
    <TouchableOpacity style={noPINStyles.card} onPress={props.onAddPIN}>
      <View style={noPINStyles.cardTopView}>
        <Image style={noPINStyles.employeeImg}
               resizeMode="contain"
               source={require('../../../public/images/Group.png')}/>
        
        <Text style={noPINStyles.topViewText}>
          Assign PIN numbers to your staff
        </Text>
      </View>
      
      <View style={noPINStyles.cardBotView}>
        <Text style={noPINStyles.botViewText}>
          Create PIN
        </Text>
      </View>
    </TouchableOpacity>
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
      onAddPIN: props => () => {
        console.log("Add PIN btn is pressed");
        Amplitude.logEvent('Add PIN btn is pressed');
        Actions.createPIN({restaurant: props.data.restaurant});
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
    branch(
        props => props.data.restaurant.PINs.length === 0 || true,
        renderComponent(noPINsDashboard)
    ),
)(ManagePINsDashboard);