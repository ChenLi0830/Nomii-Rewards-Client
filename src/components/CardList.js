import React from 'react';
import {StyleSheet, ListView, View, Text} from 'react-native';
import Card from './common/Card';
import {connect} from 'react-redux';
import {graphql} from 'react-apollo';
import {getAllRestaurantCardsQuery} from '../graphql/restaurant';
import {sortCardsByDistance, addDistanceToCards} from './api';
import {compose, pure, lifecycle} from 'recompose';
import {WithLoadingComponent} from './common';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {Amplitude} from 'expo';

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
    paddingBottom: responsiveHeight(15),
  }
});

const renderRow = (card) => {
  return (
      <View style={{paddingHorizontal: 10}}>
        <Card {...card} />
      </View>
  )
};

const CardList = (props) => {
  if (!props.location) console.warn("props.location doesn't exist");
  
  let cardsSortedByDistance = sortCardsByDistance(
      addDistanceToCards(props.data.allRestaurantCards, props.location)
  );
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(cardsSortedByDistance);
  
  return <View style={styles.wrapper}>
    <ListView dataSource={dataSource}
              enableEmptySections
              renderRow={renderRow}
              style={styles.list}>
    </ListView>
  
  </View>
};

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
    lifecycle({
      componentDidMount() {
        Amplitude.logEvent('CardList screen shows');
      }
    }),
    pure,
)(CardList);