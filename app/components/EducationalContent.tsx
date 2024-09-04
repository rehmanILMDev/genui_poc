"use client"
import React from 'react';

const EducationalContent = ({content}: any) => {

console.log(content);

  return (
    <div style={{
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      borderLeft: '5px solid #4CAF50',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h3 style={{
        color: '#333',
        fontWeight: '600',
        marginBottom: '10px',
        fontSize: '1.5em',
      }}>
        {content.topic.charAt(0).toUpperCase() + content.topic.slice(1)} Content
      </h3>
      <p style={{
        color: '#555',
        lineHeight: '1.6',
        fontSize: '1em',
      }}>
        {content.topic || 'No content available for this topic.'}
      </p>
    </div>
  );
};

export default EducationalContent;
