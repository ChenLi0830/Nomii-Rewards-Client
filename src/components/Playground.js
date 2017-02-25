import React from 'react';
import {Animated} from 'react-native';

class Playground extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bounceValue: new Animated.Value(0),
    };
  }
  render() {
    return (
        <Animated.Image                         // Base: Image, Text, View
            source={{uri: 'http://i.imgur.com/XMKOH81.jpg'}}
            style={{
              width: 50,
              height: 50,
              //flex: 0.3,
              transform: [                        // `transform` is an ordered array
                {scale: this.state.bounceValue},  // Map `bounceValue` to `scale`
              ]
            }}
        />
    );
  }
  componentDidMount() {
    this.state.bounceValue.setValue(2.5);     // Start large
    Animated.spring(                          // Base: spring, decay, timing
        this.state.bounceValue,                 // Animate `bounceValue`
        {
          toValue: 0.8,                         // Animate to smaller size
          friction: 1,                          // Bouncier spring
        }
    ).start();                                // Start the animation
  }
}

export default Playground;