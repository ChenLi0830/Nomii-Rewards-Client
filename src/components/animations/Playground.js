import React from 'react';
import {Animated} from 'react-native';

class Playground extends React.Component {
  state = {bounceValue: new Animated.Value(0)};
  
  startAnimation(){
    const {bounceValue} = this.state;
    bounceValue.setValue(2.5);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
        bounceValue,                          // Animate `bounceValue`
        {
          toValue: 1,                         // Animate to smaller size
          friction: 1,                          // Bouncier spring
        }
    ).start();                                // Start the animation
  }
  
  componentDidMount() {
    this.startAnimation();
  }
  
  render() {
    return (
        <Animated.Image                         // Base: Image, Text, View
            source={{uri: 'http://i.imgur.com/XMKOH81.jpg'}}
            style={{
              width: 50,
              height: 50,
              //flex: 0.3,
              //opacity: this.state.bounceValue,
              transform: [                       // `transform` is an ordered array
                {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
                {
                  translateY: this.state.bounceValue.interpolate({
                    inputRange: [0, 1.5],
                    outputRange: [0, 100]  // 0 : 150, 0.5 : 75, 1 : 0
                  }),
                }
              ]
            }}
        />
    );
  }

}

export default Playground;