import React from 'react';
import {View, StyleSheet,Text, Image} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {StarRating} from './common';
import {compose, withHandlers, withState} from 'recompose';
import {Button} from './common';
import {connect} from 'react-redux';
import {feedbackActions} from '../modules';
import {getTimeInSec} from './api';


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
    alignSelf: "flex-start",
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

const calcDisplayTime = (visitedAt) => {
  const timeStamp = getTimeInSec();
  const timeDifInSec = timeStamp - visitedAt;
  if (timeDifInSec < 60) return `just now`;
  const timeDifInMin = Math.floor(timeDifInSec/60);
  if (timeDifInMin < 60) return `${timeDifInMin} ${timeDifInMin>1 ? "mins" : "min"} ago`;
  const timeDifInHour = Math.floor(timeDifInMin/60);
  if (timeDifInHour < 24) return `${timeDifInHour} ${timeDifInHour>1 ? "hours" : "hour"} ago`;
  const timeDifInDay = Math.floor(timeDifInHour/24);
  return `${timeDifInDay} ${timeDifInDay>1 ? "days" : "day"} ago`;
};

const FeedbackContent1 = (props) => {
  // props.awaitFeedback
  const {visitedAt, stampCountOfCard, employeeName, restaurant, skipCount} = props.awaitFeedback;
  
  const visitedDisplayTime = calcDisplayTime(visitedAt);
  
  return (
      <View style={styles.wrapper}>
          <Text style={styles.title}>
            Please rate your
            {'\n'}
            experience
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
            Not now
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