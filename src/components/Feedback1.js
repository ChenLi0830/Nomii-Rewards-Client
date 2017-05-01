import React from 'react';
import {View, StyleSheet,Text, Image} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import {StarRating} from './common';
import {compose, withHandlers, withState} from 'recompose';
import {Button} from './common';

let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-around",
  },
  button: {
    width:responsiveWidth(80),
  }
});

const Feedback1 = (props) => {
  return (
      <View style={styles.wrapper}>
        <View>
          <Text>
            Rate your
            {'\n'}
            experience
            {'\n'}
            [at]
          </Text>
        </View>
  
        <View>
          <Text>
            Restaurant Name
          </Text>
        </View>
  
        <View>
          <Text>
            Restaurant Logo
          </Text>
        </View>
        
        <View>
          <Text> rating: {props.starCount} </Text>
          <StarRating
              disabled={false}
              maxStars={5}
              emptyStar="star-o"
              fullStar="star"
              starColor={"#FFD700"}
              emptyStarColor={"#ddd"}
              starSize = {35}
              rating={props.starCount}
              selectedStar={(rating) => props.onStarRatingPress(rating)}
          />
        </View>
        
        <Button rounded={false} style={styles.button}>
          Next
        </Button>
      </View>
  );
};

export default compose(
    withState('starCount', 'updateStarCount', 0),
    withHandlers({
      onStarRatingPress: props => (rating) => {
        props.updateStarCount(rating);
      }
    }),
)(Feedback1);