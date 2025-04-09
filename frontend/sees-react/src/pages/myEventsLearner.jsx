import React from 'react';
import { useParams } from 'react-router-dom';
import MyEvents from '../components/MyEvents'; // adjust path if needed

const MyEventsLearner = () => {
  const { userId } = useParams();

  return (
    <div className="p-6">
        <MyEvents userId={userId} />

    </div>
  );
};

export default MyEventsLearner;
