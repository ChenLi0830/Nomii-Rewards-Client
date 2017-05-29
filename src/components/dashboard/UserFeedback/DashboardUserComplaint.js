import React from 'react';
import DashboardUserFeedback from './DashboardUserFeedback';

const DashboardUserComplain = ({userName, imageURL, comment, rating, isResolved, contactInfo, leftAt, tags}) => (
    <DashboardUserFeedback {...{userName, imageURL, comment, rating, isResolved, contactInfo, leftAt, tags}} showResolved={true}/>
);

export default DashboardUserComplain;