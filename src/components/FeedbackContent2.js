import React from 'react';
import {View, StyleSheet,Text, Image} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {StarRating} from './common';
import {compose, withHandlers, withState} from 'recompose';
import {Button} from './common';
import {connect} from 'react-redux';
import {feedbackActions} from '../modules';
import TagButton from './TagButton';

let styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveWidth(5),
  },
  titleView: {
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  title:{
    fontWeight: "600",
    fontSize: responsiveFontSize(3.5),
  },
  subTitle:{
    color: "#b4b4b4",
    fontSize: responsiveFontSize(2.2),
  },
  button:{
    width:responsiveWidth(80),
  }
});

const FeedbackContent2 = (props) => {
  // props.awaitFeedback
  const {visitedAt, stampCountOfCard, employeeName, restaurant, feedbackTags} = props.awaitFeedback;
  
  console.log("feedbackTags", feedbackTags);
  
  let tagButtonGroup = [];
  for (let i=0; i<3; i++){
    tagButtonGroup.push(
        <View key={i} style={{flexDirection: "row", alignSelf: "center"}}>
          <View style={{paddingRight: responsiveWidth(3), paddingBottom: responsiveWidth(2.5)}}>
            <TagButton key={feedbackTags[i].id}>
              {feedbackTags[i].content}
            </TagButton>
          </View>
          <View style={{paddingBottom: responsiveWidth(2.5)}}>
            <TagButton key={feedbackTags[i+1].id}>
              {feedbackTags[i+1].content}
            </TagButton>
          </View>
        </View>
    )
  }
  
  return (
      <View style={styles.wrapper}>
        
        <View style={styles.titleView}>
          <Text style={styles.title}>
            What could be
            {"\n"}
            improved?
          </Text>
  
          <Text style={styles.subTitle}>
            Pick any of the following
          </Text>
        </View>
        
        <View>
          <View>
            {tagButtonGroup}
          </View>
            <View>
            
          </View>
        </View>
        
        <Button rounded={false} shadow={false} style={styles.button} onPress={props.nextFeedbackStep}>
          Submit
        </Button>
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
)(FeedbackContent2);