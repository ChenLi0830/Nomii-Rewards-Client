import React, {Component} from 'react';
import{ StyleSheet, View} from 'react-native';
import Chart from 'react-native-chart';
import {responsiveWidth, responsiveHeight} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(80),
    height: responsiveHeight(25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chart: {
    width: responsiveWidth(80),
    height: responsiveHeight(25),
  },
});

const data = [
  ['4am', 7],
  ['8am', 4.5],
  ['12pm', 3],
  ['4pm', 4],
  ['8pm', 5],
  ['12am', 6.5],
];

class SimpleChart extends Component {
  render() {
    return (
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
          />
        </View>
    );
  }
}

export default SimpleChart;