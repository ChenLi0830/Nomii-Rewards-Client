import React from 'react';
import DashboardUserFeedback from './DashboardUserFeedback';

const DashboardUserComplain = ({userName, imageURL, comment, rating, isResolved, contactInfo, leftAt, tags, resolveFeedback, unresolveFeedback, callNumber}) => (
    <DashboardUserFeedback {...{userName, imageURL, comment, rating, isResolved, contactInfo, leftAt, tags, resolveFeedback, unresolveFeedback, callNumber}} showResolved={true}/>
);

export default DashboardUserComplain;