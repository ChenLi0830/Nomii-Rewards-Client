import React, {Component} from 'react';
import {StyleSheet, ListView, Dimensions, View, TouchableOpacity} from 'react-native';
import Card from './common/Card';
import {connect} from 'react-redux';
import {homeActions} from '../modules';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import {getAllRestaurantCardsQuery} from '../graphql/restaurant';
import {calculateCardsWithDistances} from './api';

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
  // !props.data.loading && console.log("calculateCardsWithDistances(props.data.allRestaurantCards)", calculateCardsWithDistances(props.data.allRestaurantCards, props.location));
  if (!props.location) console.warn("props.location doesn't exist");
    
  let cardsSortedByDistance =  (props.data.loading) ?  [] : calculateCardsWithDistances(props.data.allRestaurantCards, props.location);
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(cardsSortedByDistance);
  
  const renderRow = (card) => {
    return (
        <TouchableOpacity TouchableOpacity style={{paddingHorizontal: 10}} activeOpacity={0.9}
                          onPress={() => props.pressCard(card)}>
          <Card {...card} />
        </TouchableOpacity>
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

const CardListWithGraphQL = graphql(getAllRestaurantCardsQuery, {
  options: (ownProps) => ({variables: {userId: ownProps.userId}}),
})(CardList);

const mapStateToProps = (state) => ({
  userId: state.user.id,
  location: state.user.location,
});

const mapDispatchToProps = (dispatch) => {
  return {
    pressCard: (card) => dispatch(homeActions.pressCard(card))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CardListWithGraphQL);