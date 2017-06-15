import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {StarRating, WithLoadingComponent} from '../common';
import {graphql} from 'react-apollo';
import {getRestaurantStatsQuery} from '../../graphql/restaurant';
import {getTimeInSec} from '../api';
import {compose} from 'recompose';

const styles = StyleSheet.create({
  wrapper: {
    height: 100,
    // flex: 1,
    alignSelf: "center",
    // top: (Platform.OS === 'ios') ? 40 : 7,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    color: "#515151",
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  ratingNumber: {
    color: "#515151",
    fontSize: 28,
    fontWeight: "600",
    marginRight: 15,
  },
});

const DashboardNavBarTitle = (props) => {
  console.log("DashboardNavBarTitle props", props);
  console.log("props.data.restaurant.statistics[3].averageRating",props.data.restaurant.statistics[3].averageRating)
  const rating = props.data.restaurant.statistics[3].averageRating;
  return <View style={styles.wrapper}>
    <Text style={styles.title}>
      {props.data.restaurant.name}
    </Text>
    
    <View style={styles.ratingView}>
      <Text style={styles.ratingNumber}>{rating > 1 ? rating.toFixed(2) : "-"}</Text>
      <StarRating starColor={"#FFCC00"} emptyStarColor={"#FFCC00"}
                  disabled rating={rating > 1 ? rating : 5} starSize={13} starStyle={{marginRight: 3}}/>
    </View>
  </View>
};

// Container
export default compose(
    graphql(getRestaurantStatsQuery, {
      options: (props) => {
        return {
          variables: {
            restaurantId: props.ownedRestaurant,
            daysToCoverList: [1, 7, 30, 365],
            endTo: getTimeInSec()
          },
        }
      },
    }),
    WithLoadingComponent,
)(DashboardNavBarTitle);
