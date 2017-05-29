import React from 'react';
import {View, StyleSheet,Text, Image} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {StarRating} from './common';
import {compose, withHandlers, withState} from 'recompose';
import {Button} from './common';
import {connect} from 'react-redux';
import {feedbackActions} from '../modules';
import {calcHowLongAgo} from './api';

let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveWidth(5),
  },
  titleView:{
    alignItems: "center",
  },
  title:{
    alignSelf: "center",
    fontWeight: "600",
    fontSize: responsiveFontSize(3.5),
  },
  subTitle: {
    color: "#808080",
    fontSize: Math.max(responsiveFontSize(1.6), 12),
  },
  restaurantName:{
    fontWeight: "600",
    fontSize: responsiveFontSize(2.8),
    marginTop: -responsiveHeight(2),
  },
  button: {
    width:responsiveWidth(80),
  },
  btnView: {
    width: responsiveWidth(80)
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
  const {visitedAt, stampCountOfCard, employeeName, restaurant, skipCount} = props.awaitFeedback;
  
  const visitedDisplayTime = calcHowLongAgo(visitedAt);
  
  return (
      <View style={styles.wrapper}>
          <Text style={styles.title}>
            How was your meal?
            {/*Please rate your*/}
            {/*{'\n'}*/}
            {/*experience*/}
          </Text>
  
        <View style={styles.titleView}>
          <Text style={styles.restaurantName}>
            {restaurant.name}
          </Text>
          <Text style={styles.subTitle}>
            {visitedDisplayTime}
          </Text>
        </View>
  
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
        
        <View style={styles.btnView}>
        {
          props.rating === 5
            &&
          <Button disabled = {props.rating === 0} rounded={false} shadow={false} style={styles.button} onPress={props.submitFeedback}>
            Submit
          </Button>
        }
        
        {
          props.rating !== 5
              &&
          <Button disabled = {props.rating === 0} rounded={false} shadow={false} style={styles.button} onPress={props.nextFeedbackStep}>
            Next
          </Button>
        }
  
          <Button shadow={false} type="skip" style={styles.button} onPress={props.skipFeedback}>
            {skipCount >= 2 ? "Skip" : "Not Now"}
          </Button>
        </View>
      </View>
  );
};

export default compose(
    connect(
        (state) => ({
          rating: state.feedback.rating,
        }),
        {
          setFeedbackRating: feedbackActions.setFeedbackRating,
          nextFeedbackStep: feedbackActions.nextFeedbackStep,
        }
    ),
)(FeedbackContent1);