import React from 'react';
import {compose, withHandlers, withState} from 'recompose';
import {View, PanResponder, ScrollView, StyleSheet, Animated, TouchableOpacity, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {List, Toast} from 'antd-mobile';
import {Button} from './common';
import {graphql} from 'react-apollo';
import {connect} from 'react-redux';
import {getAllRestaurantCardsQuery} from '../graphql/restaurant';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {WithLoadingComponent} from './common';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 74,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sideMenu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: -responsiveWidth(70),
    width: responsiveWidth(70),
    backgroundColor: "#f6f6f6",
    elevation: 2,
    overflow: null,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 3,
      width: 0
    },
  },
  list: {width: responsiveWidth(70)}
});

const SuperUserScreen = (props) => {
  console.log("SuperUserScreen props", props);
  //Handle pan gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      if (props.isVisible) return false;
      if (gestureState.dx > 0) return false;
      if (Math.abs(gestureState.dy)>Math.abs(gestureState.dx)) return false;
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < -30 && props.isVisible) {
        props.onToggleSlider();
      }
    },
  });
  
  let animStyles = {
    sideMenu: {
      transform: [
        {
          translateX: props.offsetX.interpolate({
            inputRange: [0, 1],
            outputRange: [0, responsiveWidth(70)],
          })
        }
      ],
      opacity: props.offsetX,
    }
  };
  
  const restaurantList = props.data.allRestaurantCards.map(card => {
    let {restaurant} = card;
    return <List.Item key={restaurant.id} onClick={() => props.onChooseRestaurant(restaurant.id)}>
      {restaurant.name}
      
      <View style={{alignItems: "flex-end"}}>
        <TouchableOpacity onPress={() => props.showRestaurantVisitStats(restaurant)}>
          <Text style={{color: "#3b74b6"}}>
            View Visit Stats
          </Text>
        </TouchableOpacity>
      </View>
    </List.Item>
  });

  return <View style={styles.wrapper}>
    <Button onPress={props.onToggleSlider}>
      Restaurant Dashboards
    </Button>
  
    {/* Side Menu */}
    <Animated.View style={[styles.sideMenu, animStyles.sideMenu]}>
      <ScrollView>
          <List renderHeader={() => 'Restaurant List'}
                style={styles.list}>
            {restaurantList}
          </List>
      </ScrollView>
    </Animated.View>
  </View>;
};

//需要allRestaurants, Names and ids

export default compose(
    connect(
        state => ({
          userId: state.user.id,
        }),
        null
    ),
    graphql(
        getAllRestaurantCardsQuery,
        {
          options: (props) => ({
            variables: {userId: props.userId},
            fetchPolicy: 'cache-and-network',
          }),
        }
    ),
    WithLoadingComponent,
    withState('isVisible', 'updateVisible', false),
    withState('offsetX', 'updateOffsetX', new Animated.Value(0)),
    withHandlers({
      onToggleSlider: props => () => {
        props.updateVisible(!props.isVisible);
        
        Animated.spring(props.offsetX, {
          toValue: props.isVisible ? 0 : 1,
          friction: 15,
          tension: 80,
          // duration: 300,
          // easing: Easing.in(Easing.ease),
          // easing: Easing.linear,
          // easing: Easing.elastic(2), // Springy
        }).start();
      },
      
      onChooseRestaurant: props => (restaurantId) => {
        Toast.loading('Loading', 0);
        Animated.spring(props.offsetX, {
          toValue: 0,
          friction: 15,
          tension: 80,
          // duration: 300,
          // easing: Easing.in(Easing.ease),
          // easing: Easing.linear,
          // easing: Easing.elastic(2), // Springy
        }).start(()=>{
              Toast.hide();
              Actions.statistics({ownedRestaurant: restaurantId});
            }
        );
      },
    }),
    withHandlers({
      showRestaurantVisitStats: props => (restaurant) => {
        props.onToggleSlider();
        Actions.nomiiAdminVisitStats({restaurant})
      }
    }),
)(SuperUserScreen);
