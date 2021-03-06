import React from 'react';
import{ StyleSheet, View} from 'react-native';
import Chart from 'react-native-chart';
import {responsiveWidth, responsiveHeight, responsiveFontSize} from 'react-native-responsive-dimensions';
import HightlightContainer from './HightlightContainer';

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(86),
    height: responsiveHeight(22),
    marginTop: responsiveHeight(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  chart: {
    width: responsiveWidth(86),
    height: responsiveHeight(22),
    marginTop: 5,
  },
});

// const _data = [
//   ['4am', 7],
//   ['8am', 4.5],
//   ['12pm', 3],
//   ['4pm', 4],
//   ['8pm', 5],
//   ['12am', 6.5],
// ];

// const _data = [
//   ['Jan', 7],
//   ['Feb', 4.5],
//   ['Mar', 3],
//   ['Apr', 4],
//   ['May', 5],
//   ['Jun', 6.5],
//   ['Jul', 7],
//   ['Aug', 4.5],
//   ['Sep', 3],
//   ['Oct', 4],
//   ['Nov', 5],
//   ['Dec', 6.5],
// ];
const _data = [
  ['Week 1', 7],
  ['Week 2', 4.5],
  ['Week 3', 3],
  ['Week 4', 4],
];

const ComplaintBarChart = ({data = _data}) => {
  return (
      <HightlightContainer>
        <View style={styles.container}>
          <Chart
              style={styles.chart}
              data={data}
              verticalGridStep={5}
              type="bar"
              showDataPoint={true}
              lineWidth={0}
              axisLineWidth={0}
              cornerRadius={2}
              widthPercent={2.5}
              hideVerticalGridLines={true}
              gridColor='#eee'
              color={'#E31155'}
              labelFontSize={responsiveFontSize(1.5)}
              axisLabelColor="#485465"
              animationDuration={3000}
          />
        </View>
      </HightlightContainer>
  );
};

export default ComplaintBarChart;