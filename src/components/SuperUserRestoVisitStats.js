import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {compose, } from 'recompose';
import {graphql} from 'react-apollo';
import {getRestaurantVisitStatsQuery} from '../graphql/restaurant';
import {getTimeInSec} from './api';
import {WithLoadingComponent} from './common';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const SuperUserRestoVisitStats = (props) => {
  const {RestaurantVisitStatistics={}} = props.data;
  console.log("SuperUserRestoVisitStats props", props);
  return <View style={styles.wrapper}>
    <Text>
      Visit Stats
    </Text>
    
    <Text>
      Estimate visits based on consumers' previous pattern: {parseFloat(RestaurantVisitStatistics.withoutNomiiVisit).toFixed(2)}
    </Text>
  
    <Text>
      Visits with Nomii: {parseInt(RestaurantVisitStatistics.actualVisit)}
    </Text>
  </View>
};

export default compose(
    graphql(
        getRestaurantVisitStatsQuery,
        {
          options: (props) => ({
            variables: {
              restaurantId: props.restaurant.id,
              daysToCover: 30,
              endTo: getTimeInSec(),
            }
          }),
        }
    ),
    WithLoadingComponent,
)(SuperUserRestoVisitStats);