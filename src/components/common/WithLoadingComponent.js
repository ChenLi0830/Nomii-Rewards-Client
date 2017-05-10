import React from 'react';
import {branch, renderComponent} from 'recompose';
import {Loading} from './Loading';

const WithLoadingComponent = branch(
    props => props.queryLoading || (props.data && props.data.loading),
    renderComponent(Loading),
);

export {WithLoadingComponent};