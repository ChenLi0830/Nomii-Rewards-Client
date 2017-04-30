// React and react native imports
import React, {
  Component,
  PropTypes,
} from 'react';
import { View, Animated, TouchableWithoutFeedback } from 'react-native';

// Third party imports
import Button from 'react-native-button';
import { FontAwesome } from '@expo/vector-icons';

// import EntypoIcons from 'react-native-vector-icons/Entypo';
// import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
// import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
// import FoundationIcons from 'react-native-vector-icons/Foundation';
// import IoniconsIcons from 'react-native-vector-icons/Ionicons';
// import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
// import OcticonsIcons from 'react-native-vector-icons/Octicons';
// import ZocialIcons from 'react-native-vector-icons/Zocial';

const iconSets = {
  // Entypo: EntypoIcons,
  // EvilIcons: EvilIconsIcons,
  FontAwesome: FontAwesome,
  // Foundation: FoundationIcons,
  // Ionicons: IoniconsIcons,
  // MaterialIcons: MaterialIconsIcons,
  // Octicons: OcticonsIcons,
  // Zocial: ZocialIcons,
};

/**
 * forked from react-native-star-rating
 * */

class StarButton extends Component {
  
  constructor(props) {
    super(props);
    this.onButtonPress = this.onButtonPress.bind(this);
  }
  
  onButtonPress() {
    this.props.onStarButtonPress(this.props.rating);
  }
  
  render() {
    const Icon = iconSets[this.props.iconSet];
    
    const animatedStyles = {
      bouncyStar: {
        transform: [
          {
            scale: this.props.scale.interpolate({
              inputRange: [0, 0.75, 2],
              outputRange: [1, 0.5, 1],
            })
          }
        ]
      }
    };
    
    return (
        <TouchableWithoutFeedback
            //activeOpacity={0.20}
            disabled={this.props.disabled}
            onPress={this.onButtonPress}
            //containerStyle={this.props.buttonStyle}
            //style={{height: this.props.starSize,width: this.props.starSize,}}
        >
          <Animated.View style={animatedStyles.bouncyStar}>
          <Icon
              name={this.props.starIconName}
              size={this.props.starSize}
              color={this.props.starColor}
              style={this.props.starStyle}
          />
          </Animated.View>
        </TouchableWithoutFeedback>
    );
  }
}

StarButton.propTypes = {
  disabled: PropTypes.bool,
  rating: PropTypes.number,
  onStarButtonPress: PropTypes.func,
  iconSet: PropTypes.string,
  starSize: PropTypes.number,
  starIconName: PropTypes.string,
  starColor: PropTypes.string,
  starStyle: View.propTypes.style,
  buttonStyle: View.propTypes.style,
};

export default StarButton;