import React from 'react';
import {View, Text, StyleSheet, Alert, Image, TouchableOpacity} from 'react-native';
import {responsiveWidth, responsiveFontSize, responsiveHeight} from 'react-native-responsive-dimensions';
import {getTimeInSec, calcHowLongAgo} from '../../api';
import {StarRating} from '../../common';
import GLP from 'google-libphonenumber';
import {compose, withHandlers} from 'recompose';

let PNF = GLP.PhoneNumberFormat;
let phoneUtil = GLP.PhoneNumberUtil.getInstance();

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    width: responsiveWidth(90),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: responsiveFontSize(0.8),
  },
  userView:{
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  
  userLeftView:{
    width: responsiveWidth(12),
  },
  
  profileImage:{
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(10) / 2,
  },
  
  userRightView:{
    width: responsiveWidth(70),
    alignItems: "flex-start"
  },
  
  userTopView:{
    width: responsiveWidth(70),
    marginBottom: responsiveHeight(1),
  },
  
  userInfoView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  usernameText:{
    color: "#202020",
    fontWeight: "600",
    fontSize: responsiveFontSize(1.8),
  },
  
  tagText:{
    fontSize: responsiveFontSize(1.5),
    fontStyle: "italic"
  },
  
  userMidView:{
    width: responsiveWidth(68),
  },
  
  commentText: {
    color: "#202020",
  },
  userBotView:{
    width: responsiveWidth(70),
    alignItems: "flex-end",
    marginVertical: responsiveHeight(0.5),
  },
  timeText:{
    color: "#9D9D9D",
    fontSize: responsiveFontSize(1.5),
  },
  
  resolveView: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F2",
    flexDirection: "row",
    width: responsiveWidth(90),
  },
  contactView: {
    height: responsiveHeight(7),
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#eee",
    width: responsiveWidth(45),
  },
  contactText:{
    textAlign: "center",
    color: "#3060E0",
    fontSize: responsiveFontSize(1.8),
  },
  resolveBtnView:{
    alignItems: "center",
    width: responsiveWidth(45),
    justifyContent: "center",
  },
  resolveBtnText:{
    textAlign: "center",
    color: "#FF2D55",
    fontSize: responsiveFontSize(1.8),
  },
});

const DashboardUserFeedback = (props) => {
  const {userName="Angelica Leon Elizalde", imageURL="https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/15873523_10154240946525318_3382655087574399935_n.jpg?oh=bf426df3a0b99f39cbe7a9947a6715e7&oe=59B4D59E", comment="We used to love coming here... today was a big disappointment! 1:20 waiting time, portions were smaller than usual (almost half), tacos were cold...what happened?", rating = 4, showResolved = false, isResolved=false, contactInfo="1 6044013925", leftAt=getTimeInSec(), tags=["Service", "Food", "Speed", "Attitude", "Cleanliness"]} = props;
  
  return <View style = {[styles.wrapper, showResolved && {paddingBottom: 0}]}>
    
    <View style={styles.userView}>
      
      <View style={styles.userLeftView}>
        <Image resizeMode={Image.resizeMode.contain}
               style={styles.profileImage}
               source={{uri: imageURL}}/>
      </View>
      
      <View style={styles.userRightView}>
        <View style={styles.userTopView}>
          <View style={styles.userInfoView}>
            
            <Text style={styles.usernameText}>
              {userName}
            </Text>
            
            <View style={styles.ratingView}>
              <StarRating starColor={"#FFCC00"} emptyStarColor={"#FFCC00"}
                          disabled rating={rating} starSize={responsiveFontSize(1.5)} starStyle = {{marginRight: responsiveFontSize(0.2)}}/>
            </View>
            
          </View>
          
          {
            showResolved
            &&
            <View style={styles.tagsView}>
              <Text style={styles.tagText}>
                Complaints: {tags.join(", ")}
              </Text>
            </View>
          }
        </View>
  
        <View style={styles.userMidView}>
          <Text>
            {comment}
          </Text>
        </View>
  
        <View style={styles.userBotView}>
          <Text style={styles.timeText}>
            {calcHowLongAgo(leftAt - 60 * 18)}
          </Text>
        </View>
      </View>
    </View>
    
    {
      showResolved
          &&
      <View style={styles.resolveView}>
        <View style={styles.contactView}>
          <Text style={styles.contactText}>
            {phoneUtil.format(phoneUtil.parse(contactInfo, 'CA'), PNF.NATIONAL)}
          </Text>
        </View>
  
        <TouchableOpacity onPress={props.resolveAlert} style={styles.resolveBtnView}>
          <Text style={styles.resolveBtnText}>
            {isResolved ? "Unresolve" : "Resolve"}
          </Text>
        </TouchableOpacity>
      </View>
    }
  </View>
};

export default compose(
    withHandlers({
      resolveAlert: props => (restaurantId, code) => {
        if (!props.isResolved){
          Alert.alert(
              'Resolve Complaint',
              'Are you sure you want to mark this complaint as resolved?',
              [
                {
                  text: 'Cancel', onPress: () => {}, style: 'cancel'
                },
                {
                  text: 'Resolve',
                  onPress: () => props.resolveFeedback(props.leftAt),
                  style: 'default'
                },
              ],
              {cancelable: false}
          );
        }
        else {
          Alert.alert(
              'Unresolve Complaint',
              'Are you sure you want to mark this complaint as unresolved?',
              [
                {
                  text: 'Cancel', onPress: () => {}, style: 'cancel'
                },
                {
                  text: 'Unresolve',
                  onPress: () => props.unresolveFeedback(props.leftAt)/*props.removePIN(restaurantId, code)*/,
                  style: 'default',
                },
              ],
              {cancelable: false},
          );
        }
        
        
      }
    }),
)(DashboardUserFeedback);