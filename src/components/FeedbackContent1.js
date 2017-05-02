import React from 'react';
import {View, StyleSheet,Text, Image} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {StarRating} from './common';
import {compose, withHandlers, withState} from 'recompose';
import {Button} from './common';
import {connect} from 'react-redux';
import {appActions} from '../modules';


let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveWidth(5),
  },
  title:{
    alignSelf: "flex-start",
    fontWeight: "600",
    fontSize: responsiveFontSize(3.5),
  },
  restaurantName:{
    fontWeight: "600",
    fontSize: responsiveFontSize(2.8),
    marginTop: -responsiveHeight(2),
  },
  button: {
    width:responsiveWidth(80),
  },
  storeLogo:{
    width: responsiveWidth(36),
    height: responsiveWidth(27),
    marginTop: -responsiveHeight(3),
    borderRadius: 5,
  },
  ratingView:{
    marginBottom:-30,
    width: responsiveWidth(60)
  },
  ratingSummary:{
    paddingBottom: 10,
    alignSelf: "center",
    fontSize: responsiveFontSize(2.2),
  }
});

const ratingToReview = {
  0: "Please Rate",
  1: "Terrible",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

const FeedbackContent1 = (props) => {
  // props.awaitFeedback
  const {visitedAt, stampCountOfCard, employeeName, restaurant} = props.awaitFeedback;
  return (
      <View style={styles.wrapper}>
          <Text style={styles.title}>
            Rate your
            {'\n'}
            experience
            {'\n'}
            [at]
          </Text>
  
          <Text style={styles.restaurantName}>
            {restaurant.name}
          </Text>
  
          <Image resizeMode={Image.resizeMode.contain}
                 style={styles.storeLogo}
                 source={{uri: restaurant.imageURL}}/>
        
        <View style={styles.ratingView}>
          <Text style={styles.ratingSummary}> {ratingToReview[props.rating]} </Text>
          <StarRating
              disabled={false}
              maxStars={5}
              emptyStar="star-o"
              fullStar="star"
              starColor={"#FFD700"}
              emptyStarColor={"#ddd"}
              starSize = {40}
              rating={props.rating}
              selectedStar={props.setFeedbackRating}
          />
        </View>
        
        <Button disabled = {props.rating === 0} rounded={false} shadow={false} style={styles.button} onPress={props.nextFeedbackStep}>
          Next
        </Button>
      </View>
  );
};

export default compose(
    connect(
        (state) => ({
          rating: state.app.feedbackRating,
        }),
        {
          setFeedbackRating: appActions.setFeedbackRating,
          nextFeedbackStep: appActions.nextFeedbackStep,
        }
    ),
)(FeedbackContent1);