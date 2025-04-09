import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FeedbackChart = ({ rating, themeData }) => {
  // For the rating gauge (semi-circle)
  const ratingData = [
    { name: 'Rating', value: rating },
    { name: 'Empty', value: 5 - rating }
  ];
  const COLORS = ['#0088FE', '#ECEFF1'];
  
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h4>Average Rating: {rating}/5</h4>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={ratingData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
            >
              {ratingData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <h4>Top Comment Themes</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={themeData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" name="Mentions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedbackChart;