import React from 'react';
import DashboardUserFeedback from './DashboardUserFeedback';

const DashboardUserRating = ({userName, imageURL, comment, rating, leftAt}) => (
    <DashboardUserFeedback {...{userName, imageURL, comment, rating, leftAt}}/>
);

export default DashboardUserRating;