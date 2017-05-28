// React and react native imports
import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import React, {
  Component,
  PropTypes,
} from 'react';

// Local file imports
import StarButton from './StarButton';

const styles = StyleSheet.create({
  starRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

/**
 * forked from react-native-star-rating
 * */

class StarRating extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      maxStars: this.props.maxStars,
      scale: new Animated.Value(0),
    };
    
    this.onStarButtonPress = this.onStarButtonPress.bind(this);
  }
  
  onStarButtonPress(rating) {
    this.props.selectedStar(rating);
  
    this.setState({scale: new Animated.Value(0)}, ()=>{
      Animated.spring(
          this.state.scale,
          {
            toValue: 2,
            friction: 3,
          }
      ).start();
    });
  }
  
  round(number) {
    return (Math.round(number * 2) / 2);
  }
  
  render() {
    // Round rating down to nearest .5 star
    let starsLeft = this.round(this.props.rating);
    let starButtons = [];
    
    for (let i = 0; i < this.state.maxStars; i++) {
      let starIconName = this.props.emptyStar;
      let starColor = this.props.emptyStarColor;
      
      if (starsLeft >= 1) {
        starIconName = this.props.fullStar;
        starColor = this.props.starColor;
      } else if (starsLeft === 0.5) {
        starIconName = this.props.halfStar;
        starColor = this.props.starColor;
      }
      
      starButtons.push(
          <StarButton
              activeOpacity={0.20}
              disabled={this.props.disabled}
              key={i}
              rating={i + 1}
              scale={this.props.rating > i ? this.state.scale : new Animated.Value(0)}
              onStarButtonPress={this.onStarButtonPress}
              iconSet={this.props.iconSet}
              starSize={this.props.starSize}
              starIconName={starIconName}
              starColor={starColor}
              starStyle={this.props.starStyle}
              buttonStyle={this.props.buttonStyle}
          />
      );
      starsLeft--;
    }
    
    if (this.props.horizontalReverse) starButtons.reverse();
    
    return (
        <View style={styles.starRatingContainer}>
          {starButtons}
        </View>
    );
  }
}

StarRating.propTypes = {
  disabled: PropTypes.bool,
  emptyStar: PropTypes.string,
  fullStar: PropTypes.string,
  halfStar: PropTypes.string,
  iconSet: PropTypes.string,
  maxStars: PropTypes.number,
  rating: PropTypes.number,
  selectedStar: PropTypes.func,
  starColor: PropTypes.string,
  emptyStarColor: PropTypes.string,
  starSize: PropTypes.number,
  starStyle: View.propTypes.style,
  buttonStyle: View.propTypes.style,
  horizontalReverse: PropTypes.bool,
};

StarRating.defaultProps = {
  disabled: false,
  emptyStar: 'star-o',
  fullStar: 'star',
  halfStar: 'star-half-o',
  iconSet: 'FontAwesome',
  maxStars: 5,
  rating: 0,
  starColor: 'black',
  emptyStarColor: 'gray',
  starSize: 40,
  starStyle: {},
  buttonStyle: {},
  horizontalReverse: false,
};

export {StarRating};