import React from 'react';

const Label = ({ id, color, text }) => {
  return (
    <div className="task-label" 
      id={id}
      style={{ backgroundColor: color }} 
      title={text}>
    </div>
  );
};

export default Label;
