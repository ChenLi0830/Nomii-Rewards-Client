import React from 'react';
import DashboardUserFeedback from './DashboardUserFeedback';

const DashboardUserComplain = ({userName, imageURL, comment, rating, isResolved, contactInfo, leftAt, tags, resolveFeedback, unresolveFeedback}) => (
    <DashboardUserFeedback {...{userName, imageURL, comment, rating, isResolved, contactInfo, leftAt, tags, resolveFeedback, unresolveFeedback}} showResolved={true}/>
);

export default DashboardUserComplain;