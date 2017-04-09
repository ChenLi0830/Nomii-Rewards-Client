import React from 'react';
import {StyleSheet, ListView, Dimensions, View} from 'react-native';
import Card from './common/Card';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {getAllRestaurantCardsQuery} from '../graphql/restaurant';
import {calculateCardsWithDistances} from './api';
import {compose} from 'recompose';
import {WithLoadingComponent} from './common';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: "#ececec",
  },
  list: {
    marginTop: 74,
    flex: 1,
    
    paddingTop: 10,
    paddingBottom: height * 0.15,
  }
});

const CardList = (props) => {
  // console.log("props", props);
  // !props.data.loading &&
  // console.log("calculateCardsWithDistances(props.data.allRestaurantCards)",
  // calculateCardsWithDistances(props.data.allRestaurantCards, props.location));
  if (!props.location) console.warn("props.location doesn't exist");
  
  let cardsSortedByDistance = calculateCardsWithDistances(props.data.allRestaurantCards, props.location);
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(cardsSortedByDistance);
  
  const renderRow = (card) => {
    return (
        <View style={{paddingHorizontal: 10}}>
          <Card {...card} />
        </View>
    )
  };
  
  
  return <View style={styles.wrapper}>
    <ListView dataSource={dataSource}
              enableEmptySections
              renderRow={(card) => renderRow(card)}
              style={styles.list}>
    </ListView>
  
  </View>
}

// Container
export default compose(
    connect(
        state => ({
          userId: state.user.id,
          location: state.user.location,
        }),
        null
    ),
    graphql(
        getAllRestaurantCardsQuery,
        {
          options: (ownProps) => ({
            variables: {userId: ownProps.userId}
          }),
        }
    ),
    WithLoadingComponent,
)(CardList);