import React from 'react';
import {compose, withHandlers, withState} from 'recompose';
import {View, PanResponder, ScrollView, StyleSheet, Animated} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {List} from 'antd-mobile';
import {Button} from './common';
import {responsiveWidth} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sideMenu: {
    position: "absolute", top: 0, bottom: 0,
    left: -responsiveWidth(80), width: responsiveWidth(80), backgroundColor: "#f6f6f6"
  },
});

const SuperUserScreen = (props) => {
  //Handle pan gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
      if (props.isVisible) return false;
      if (gestureState.dx > 0) return false;
      if (Math.abs(gestureState.dy)>30) return false;
      return true;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx < -50 && props.isVisible) {
        props.onToggleSlider();
      }
    },
  });
  
  console.log("panResponder.panHandlers", panResponder.panHandlers);
  
  let restaurants = [
    {name: "Poke Bar", id: "ea596b9d-da36-4737-aef5-0296f9297bc8"},
    {name: "Kosoo", id: "c964fbf4-9329-4562-b041-1d1d428e0881"},
  ];
  
  console.log("props.offsetX", props.offsetX);
  
  let animStyles = {
    sideMenu: {
      transform: [
        {
          translateX: props.offsetX.interpolate({
            inputRange: [0, 1],
            outputRange: [0, responsiveWidth(60)],
          })
        }
      ],
    }
  };
  
  const restaurantList = restaurants.map(restaurant => {
    return <List.Item key={restaurant.id}>{restaurant.name}</List.Item>
  });

  return <View style={styles.wrapper}>
    <Button onPress={props.onToggleSlider}>
      Open Slider
    </Button>
  
    {/* Side Menu */}
    <Animated.View style={[styles.sideMenu, animStyles.sideMenu]}>
      <ScrollView {...panResponder.panHandlers} style={{flex: 1}}>
          <List renderHeader={() => 'Restaurant List'}
                style={{left: responsiveWidth(20), width: responsiveWidth(60)}}>
            {restaurantList}
          </List>
      </ScrollView>
    </Animated.View>
  </View>;
};

//需要allRestaurants, Names and ids

export default compose(
    withState('isVisible', 'updateVisible', false),
    withState('offsetX', 'updateOffsetX', new Animated.Value(0)),
    withHandlers({
      onToggleSlider: props => () => {
        console.log("clicked");
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
      
      onChooseRestaurant: props => (args) => {
        console.log("args", args);
        Actions.statistics({ownedRestaurant: args.restaurantId});
      }
    }),
)(SuperUserScreen);
