import React from 'react';
import {FlatList, ScrollView, Text, StyleSheet, View} from 'react-native';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import {compose, lifecycle, withHandlers, withState, branch, renderComponent} from 'recompose';
import EmployeePINItem from '../EmployeePINItem';
import {getTimeInSec} from '../api';
import {Amplitude} from 'expo';
import {Button, WithLoadingComponent} from '../common';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import _ from 'lodash';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 120,
    backgroundColor: "#f9f9f9",
  },
  assignPINView: {
    marginVertical: 20,
  },
  PINList: {
    marginBottom: 30,
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
                            code={PIN.code} employeeName={PIN.employeeName}
                            usageCount={PINCountOverDays ? PINCountOverDays.count : 0}/>;
  });
  
  return <View style={styles.wrapper}>
    <ScrollView style={{backgroundColor: "#f9f9f9",}}>
      <View style={styles.PINList}>
        {PINList}
      </View>
      
      <Button style={styles.button} type="primary2" rounded={false} shadow={false}
              onPress={props.onAddPIN}>
        Create PIN
      </Button>
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
    branch(
        props => props.data.restaurant.PINs.length === 0 || true,
        renderComponent(()=><View><Text>No PINs</Text></View>)
    )
)(ManagePINsDashboard);