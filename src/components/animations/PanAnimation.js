import React, { Component } from 'react'
import { StyleSheet, View, Text, PanResponder, Animated} from 'react-native'

export default class PanAnimation extends Component {
  
  state = {
    pan: new Animated.ValueXY({x:0, y:0}),
    dragging: false,
    initialTop: 0,
    initialLeft: 50,
    offsetTop: 50,
    offsetLeft: 0,
  };
  
  panResponder = {};
  
  componentWillMount() {
    this.state.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {
        dx: this.state.pan.x, // x,y are Animated.Value
        dy: this.state.pan.y,
      }]),
      
      onPanResponderRelease: () => {
        console.warn("this.state.pan.x", this.state.pan.x);
        Animated.spring(
            this.state.pan,         // Auto-multiplexed
            {toValue: {x: 0, y: 0}} // Back to zero
        ).start();
      },
    });
    // this.panResponder = PanResponder.create({
    //   onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
    //   onPanResponderGrant: this.handlePanResponderGrant,
    //   onPanResponderMove: this.handlePanResponderMove,
    //   onPanResponderRelease: this.handlePanResponderEnd,
    //   onPanResponderTerminate: this.handlePanResponderEnd,
    // })
  }
  
  render() {
    const {dragging, initialTop, initialLeft, offsetTop, offsetLeft} = this.state
    
    // Update style with the state of the drag thus far
    const style = {
      backgroundColor: dragging ? 'skyblue' : 'steelblue',
      top: initialTop + offsetTop,
      left: initialLeft + offsetLeft,
    }
    
    return (
        <View {...this.state.panResponder.panHandlers} style={styles.container}>
          <Animated.Image                         // Base: Image, Text, View
              source={{uri: 'http://i.imgur.com/XMKOH81.jpg'}}
              style={{
                width: 50,
                height: 50,
                //flex: 1,
                //opacity: this.state.bounceValue,
                transform: [                       // `transform` is an ordered array
                  {
                    translateY: this.state.pan.y,
                  },
                  {
                    translateX: this.state.pan.x,
                  }
                ]
              }}
          />
        </View>
    )
  }
  
  // Should we become active when the user presses down on the square?
  handleStartShouldSetPanResponder = (e, gestureState) => {
    return true
  }
  
  // We were granted responder status! Let's update the UI
  handlePanResponderGrant = (e, gestureState) => {
    this.setState({dragging: true})
  };
  
  // Every time the touch/mouse moves
  handlePanResponderMove = (e, gestureState) => {
    
    // Keep track of how far we've moved in total (dx and dy)
    this.setState({
      offsetTop: gestureState.dy,
      offsetLeft: gestureState.dx,
    })
  }
  
  // When the touch/mouse is lifted
  handlePanResponderEnd = (e, gestureState) => {
    const {initialTop, initialLeft} = this.state
    
    // The drag is finished. Set the initialTop and initialLeft so that
    // the new position sticks. Reset offsetTop and offsetLeft for the next drag.
    this.setState({
      dragging: false,
      initialTop: initialTop + gestureState.dy,
      initialLeft: initialLeft + gestureState.dx,
      offsetTop: 0,
      offsetLeft: 0,
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  }
})

