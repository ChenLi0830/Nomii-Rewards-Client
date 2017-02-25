import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Button} from 'antd-mobile';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  }
});

const AddCards = () => {
  return <View style={styles.view}>
    <Text> Your wallet seem empty. Add a card to start</Text>
    <Button type="primary" onClick={() => Actions.cardList()}>ADD CARDS</Button>
  </View>
};

export default AddCards;