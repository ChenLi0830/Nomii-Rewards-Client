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
  text: {
    textAlign: "center",
  }
});

const SuperUserRestoVisitStats = (props) => {
  const {RestaurantVisitStatistics={}} = props.data;
  console.log("SuperUserRestoVisitStats props", props);
  return <View style={styles.wrapper}>
    <Text>
      Visit Stats
    </Text>
    
    <Text style={styles.text}>
      Estimated visits based on consumers' feedbacks: {parseFloat(RestaurantVisitStatistics.withoutNomiiVisit).toFixed(2)}
    </Text>
  
    <Text style={styles.text}>
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
            },
            // fetchPolicy: 'cache-and-network',
          }),
        }
    ),
    WithLoadingComponent,
)(SuperUserRestoVisitStats);