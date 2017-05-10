import React from 'react';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';


const Loading = () => (
    <View style={{flex: 1}}>
      <Spinner visible overlayColor="rgba(255, 255, 255, 0.1)" color="#aaa"/>
    </View>
);

export {Loading}