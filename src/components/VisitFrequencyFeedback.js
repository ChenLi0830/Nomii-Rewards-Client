import React from 'react';
import {View, Text, Image, StyleSheet, Picker, Switch, Platform, Easing, Keyboard, Animated} from 'react-native';
import {InputBox} from './common';
import {responsiveFontSize, responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Button, BackButton} from './common';
import {compose, lifecycle, withState, withHandlers, onlyUpdateForKeys} from 'recompose';
import {connect} from 'react-redux';
import {feedbackActions, appActions} from '../modules';

const pickerHeight = Platform.OS === "android" ? 100 : 220;
let highLight = new Animated.Value(1);
let visibility = new Animated.Value(1);

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
  pickerLeft: {
    width: Platform.OS === "android" ? responsiveWidth(30) : responsiveWidth(40),
  },
  pickerRight: {
    width: Platform.OS === "android" ? responsiveWidth(50) : responsiveWidth(50)
  },
  title:{
    alignSelf: "center",
    fontWeight: "600",
    fontSize: responsiveFontSize(3.3),
  },
  contentView: {
    width: responsiveWidth(80),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ededef",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  contentText:{
    fontSize: Math.max(responsiveFontSize(2), 15)
  },
  contentTextHighlight:{
    fontSize: Math.max(responsiveFontSize(2), 15),
    color: "#4A90E2"
  },
  pickerView:{
    flexDirection: "row",
    width: responsiveWidth(90),
    justifyContent: Platform.OS === "android" ? "flex-end" : "center",
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
});

const visitTimeItems = {
  Week: [
    <Picker.Item label="1X" key="1X" value={1} />,
    <Picker.Item label="2X" key="2X" value={2} />,
    <Picker.Item label="3X" key="3X" value={3} />,
    <Picker.Item label="4X" key="4X" value={4} />,
    <Picker.Item label="5X" key="5X" value={5} />,
    <Picker.Item label="6X" key="6X" value={6} />,
    <Picker.Item label="7X" key="7X" value={7} />,
  ],
  Month: [
    <Picker.Item label="1X" key="1X" value={1} />,
    <Picker.Item label="2X" key="2X" value={2} />,
    <Picker.Item label="3X" key="3X" value={3} />,
  ],
  Year: [
    <Picker.Item label="1X" key="1X" value={1} />,
    <Picker.Item label="2X" key="2X" value={2} />,
    <Picker.Item label="3X" key="3X" value={3} />,
    <Picker.Item label="4X" key="4X" value={4} />,
    <Picker.Item label="5X" key="5X" value={5} />,
    <Picker.Item label="6X" key="6X" value={6} />,
    <Picker.Item label="7X" key="7X" value={7} />,
    <Picker.Item label="8X" key="8X" value={8} />,
    <Picker.Item label="9X" key="9X" value={9} />,
    <Picker.Item label="10X" key="10X" value={10} />,
    <Picker.Item label="11X" key="11X" value={11} />,
  ],
};

const VisitFrequencyFeedback = (props) => {
  const {visitedAt, stampCountOfCard, employeeName, restaurant, skipCount} = props.awaitFeedback;
  
  const animatedStyles = {
    spaceHolder: {
      height: visibility.interpolate({
        inputRange: [0,1],
        outputRange: [0, pickerHeight],
      }),
      opacity: visibility,
    },
    visitText: {
      opacity: highLight,
    }
  };
  
  return <View style={styles.wrapper}>
    <Text style={styles.title}>
      How often do you eat at
    </Text>
  
    <View style={styles.titleView}>
      <Text style={styles.restaurantName}>
        {restaurant.name}
      </Text>
    </View>
  
    <View>
      <View style={styles.contentView}>
        <Text style={styles.contentText}>First Time</Text>
        <Switch
            onValueChange={props.onChangeFirstTime}
            value={props.isFirstTime} />
      </View>
    
      <View style={styles.contentView}>
        <Text style={styles.contentText}>Visit: </Text>
        <Animated.Text style={[styles.contentTextHighlight, animatedStyles.visitText]}>
          {
            props.isFirstTime ?
                "This is my first time here"
                :
                props.times + ` time${props.times>1 ? "s" : ""} Per ` + props.period
          }
        </Animated.Text>
      </View>
    </View>
  
    <Animated.View style={[styles.pickerView, animatedStyles.spaceHolder]}>
      <Picker
          itemStyle={{textAlign: "right"}}
          style={styles.pickerLeft}
          selectedValue={props.times}
          onValueChange={props.onChangeVisitTimes}>
        {visitTimeItems[props.period]}
      </Picker>
      <Picker
          style={styles.pickerRight}
          selectedValue={props.period}
          onValueChange={props.onChangePeriod}>
        <Picker.Item label="Per Week" value="Week" />
        <Picker.Item label="Per Month" value="Month" />
        <Picker.Item label="Per Year" value="Year" />
      </Picker>
    </Animated.View>
  
    <View style={styles.btnView}>
      <Button disabled = {props.rating === 0} rounded={false} shadow={false} style={styles.button} onPress={props.onSubmitFeedback}>
        Submit
      </Button>
      <Button shadow={false} type="skip" style={styles.button} onPress={props.onSkipFeedback}>
        {skipCount >= 2 ? "Skip" : "Not Now"}
      </Button>
    </View>
  </View>
};

export default compose(
    connect(
        (state) => ({
          isFirstTime: state.feedback.isFirstTime,
          times: state.feedback.visitTimes,
          period: state.feedback.timePeriod,
        }),
        {
          changeIsFirstTime: feedbackActions.changeIsFirstTime,
          onChangePeriod: feedbackActions.changeTimePeriod,
          onChangeVisitTimes: feedbackActions.changeVisitTimes,
        }
    ),
    withHandlers({
      onChangeFirstTime : props => (isFirstTime) => {
        // console.log(value);
        props.changeIsFirstTime(isFirstTime);
  
        Animated.timing(
            visibility,
            {
              toValue: isFirstTime ? 0 : 1,
              duration: 300,
              easing: Easing.out(Easing.quad),
            }
        ).start();
      },
      onSubmitFeedback: props => () => {
        props.submitFeedback();
        // reset animation values
        setTimeout(()=>{
          highLight = new Animated.Value(1);
          visibility = new Animated.Value(1);
        }, 500);
      },
      onSkipFeedback: props => () => {
        props.skipFeedback();
        // reset animation values
        setTimeout(()=>{
          highLight = new Animated.Value(1);
          visibility = new Animated.Value(1);
        }, 500);
      }
    }),
    onlyUpdateForKeys(['isFirstTime', 'times', 'period']),
    lifecycle({
      componentWillReceiveProps(nextProps){
        highLight = new Animated.Value(0);
        Animated.spring(
            highLight,
            {
              toValue: 1,
              friction: 5,
            }
        ).start();
      },
    })
)(VisitFrequencyFeedback);