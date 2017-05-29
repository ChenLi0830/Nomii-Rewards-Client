import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {StarRating} from '../common';

const barStyles = StyleSheet.create({
  containerBar:{
    backgroundColor: "#F6F6F7",
  },
  progressBar:{
    backgroundColor: "#E31155",
  }
});

const rowStyles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    width: responsiveWidth(86),
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: responsiveHeight(0.5),
  },
  textView:{
    width: responsiveWidth(8),
  },
  text: {
    textAlign: "left",
    color: "rgba(0,0,0,0.7)",
    fontSize: responsiveFontSize(1.5),
  }
});

const cardStyles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: responsiveWidth(2),
    marginBottom: responsiveHeight(1),
  },
  ratingView:{
    flexDirection: "row",
    alignItems: "center",
  },
  text:{
    color: "rgba(0,0,0,0.7)",
    fontSize: responsiveFontSize(3.5),
    fontWeight: "600",
    marginRight: responsiveFontSize(1),
  },
  totalRatingText:{
    color: "rgba(0,0,0,0.7)",
    fontSize: responsiveFontSize(1.8),
  },
});

const RatingProgressBar = ({height = responsiveHeight(1.4), width = responsiveWidth(50), progress=70, total = 100}) => {
  const percentage = progress / total;
  
  return <View>
    <View style={[barStyles.containerBar, {borderRadius:height*0.4, height: height, width: width, top: height/2}]}/>
    <View style={[barStyles.progressBar, {borderRadius:height*0.4, height: height, width: percentage * width, top: -height/2}]}/>
  </View>
};

const RatingRow = ({rating, progress = 70, total = 100}) => {
  return <View style={rowStyles.wrapper}>
    <View>
      <StarRating starColor={"#FFCC00"} emptyStarColor={"#FFCC00"} horizontalReverse
                  disabled rating={rating} starSize={responsiveFontSize(1.7)} starStyle = {{marginRight: responsiveFontSize(0.6)}}/>
    </View>
    
    <View>
      <RatingProgressBar progress={progress} total = {total}/>
    </View>
    
    <View style={rowStyles.textView}>
      <Text style={rowStyles.text}>
        {Math.round((progress / total) * 100)}%
      </Text>
    </View>
  </View>
};

const RatingCard = ({progressList = [80,12,13,5,10], total=120, rating = 4.3}) => {
  let RatingRows = progressList.map((progress, i) => (
      <RatingRow key = {i} rating={5-i} progress={progress} total = {total}/>
  ));
  return <View>
    <View style={cardStyles.headerView}>
      <View style={cardStyles.ratingView}>
        <Text style={cardStyles.text}>
          {rating}
        </Text>
        <StarRating starColor={"#FFCC00"} emptyStarColor={"#FFCC00"}
                    disabled rating={rating} starSize={responsiveFontSize(2.5)} starStyle = {{marginRight: responsiveFontSize(0.7)}}/>
      </View>
      
      <Text style={cardStyles.totalRatingText}>
        {total + (total > 1 ? " ratings" : " rating")}
      </Text>
    </View>
    
    {RatingRows}
  </View>
};


export default RatingCard;