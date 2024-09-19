import React, { useState, useEffect } from 'react';
// import './index.css';
import { Card, Space } from 'antd';

const DraggableCard = ({ title, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  return (
    <Card
      title={title}
      extra={<a href="#">More</a>}
      style={{
        width: 300,
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </Card>
  );
};

const ESDTableView = () => (
  <Space direction="vertical" size={16}>
    <DraggableCard title="Default size card">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </DraggableCard>
    <DraggableCard title="Small size card">
      <p>Card content</p>
      <p>Card content</p>
      <p>Card content</p>
    </DraggableCard>
  </Space>
);

export default ESDTableView;
