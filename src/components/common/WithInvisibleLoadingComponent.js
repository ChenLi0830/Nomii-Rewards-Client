import React from 'react';
import {branch, renderComponent} from 'recompose';
import {View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = () => (
    <View/>
);

const WithInvisibleLoadingComponent = branch(
    props => props.data.loading,
    renderComponent(Loading),
);

export {WithInvisibleLoadingComponent};