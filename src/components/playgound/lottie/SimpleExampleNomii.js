import React from 'react';
import { Animated } from 'react-native';
import Animation from 'lottie-react-native';

// export default class BasicExample extends React.Component {
//   componentDidMount() {
//     this.animation.play();
//   }
//
//   render() {
//     return (
//         <Animation
//             ref={animation => { this.animation = animation; }}
//             style={{
//               width: 533,
//               height: 246,
//             }}
//             source={require('../../../../public/lotte/button.json')}
//         />
//     );
//   }
// }

export default class BasicExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 5000,
    }).start();
  }

  render() {
    return (
        <Animation
            style={{width: 266,height: 123}}
            source={require('../../../../public/lotte/button101.json')}
            progress={this.state.progress}
        />
    );
  }
}
