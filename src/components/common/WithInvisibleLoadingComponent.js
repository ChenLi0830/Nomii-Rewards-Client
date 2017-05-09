import React from 'react';
import {branch, renderNothing} from 'recompose';

const WithInvisibleLoadingComponent = branch(
    props => props.data.loading,
    renderNothing,
);

export {WithInvisibleLoadingComponent};