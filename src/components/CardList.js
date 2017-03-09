import React, {Component} from 'react';
import {StyleSheet, ListView, Dimensions, View, TouchableOpacity} from 'react-native';
import Card from './common/Card';
import {connect} from 'react-redux';
import {homeActions} from '../modules';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  list: {
    marginTop: 74,
    flex: 1,
    
    paddingTop: 10,
    paddingBottom: height * 0.15,
  }
});

const CardList = (props) => {
  const renderRow = (cardEdge) => {
    return (
        <TouchableOpacity TouchableOpacity style={{paddingHorizontal: 10}} activeOpacity={0.9}
                          onPress={() => props.pressCard(cardEdge)}>
          <Card {...cardEdge} />
        </TouchableOpacity>
    )
  };
  
  const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  const dataSource = ds.cloneWithRows(props.data.loading ? [] : props.data.edgesOfAllCards);
  
  return <View style={styles.wrapper}>
    <ListView dataSource={dataSource}
              enableEmptySections
              renderRow={(card) => renderRow(card)}
              style={styles.list}>
    </ListView>
  
  </View>
}

// Container
const query = gql`
query getAllCardEdges($userId: ID){
  edgesOfAllCards(userId: $userId){
    id,
    stampCount,
    lastStampAt,
    card{
      name,
      id,
      imageURL
    }
  }
}
`;

const CardListWithGraphQL = graphql(query, {
  options: (ownProps) => ({variables: {userId: ownProps.userId}}),
})(CardList);

const mapStateToProps = (state) => ({
  userId: state.user.id,
});

const mapDispatchToProps = (dispatch) => {
  return {
    pressCard: (card) => dispatch(homeActions.pressCard(card))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CardListWithGraphQL);