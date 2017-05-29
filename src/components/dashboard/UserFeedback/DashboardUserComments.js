import React from 'react';
import DashboardUserFeedback from './DashboardUserFeedback';

const DashboardUserComment = ({userName, imageURL, comment, rating, leftAt}) => (
    <DashboardUserFeedback {...{userName, imageURL, comment, rating, leftAt}}/>
);

export default DashboardUserComment;