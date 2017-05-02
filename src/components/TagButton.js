import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {connect} from 'react-redux';
import {compose, withHandlers} from 'recompose';
import {feedbackActions} from '../modules';

const styles = StyleSheet.create({
  containerBase:{
    borderColor: "#E41856",
    borderWidth: 1,
    width: responsiveWidth(36.5),
    borderRadius: 5,
    overflow: "hidden",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  containerSelected: {
    backgroundColor: "#E41856",
  },
  
  textBase:{
    color: "#E41856",
    fontSize: responsiveFontSize(1.5),
  },
  textSelected: {
    color: "#fff",
  }
});

const TagButton = (props) => {
  console.log("tagbutton props", props);
  return <TouchableWithoutFeedback onPress={props.onTagPress}>
    <View style={[styles.containerBase, props.selected && styles.containerSelected]}>
      <Text style={[styles.textBase, props.selected && styles.textSelected]}>
        {props.children}
      </Text>
  </View>
  </TouchableWithoutFeedback>
};

export default compose(
    connect(
        null,
        {toggleFeedbackTag: feedbackActions.toggleFeedbackTag,}
    ),
    withHandlers({
      onTagPress: props => ()=>{
        console.log("onTagPress", props.id);
        props.toggleFeedbackTag(props.id);
      }
    }),
)(TagButton);