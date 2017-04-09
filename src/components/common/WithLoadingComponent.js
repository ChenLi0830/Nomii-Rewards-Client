import React from 'react';
import {branch, renderComponent} from 'recompose';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';


const Loading = () => (
    <View style={{flex: 1}}>
      <Spinner visible overlayColor="rgba(255, 255, 255, 0.1)" color="#aaa"/>
    </View>
);

const WithLoadingComponent = branch(
    props => props.data.loading,
    renderComponent(Loading),
);

export {WithLoadingComponent};