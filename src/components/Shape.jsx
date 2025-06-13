import React, { useState } from 'react';

const Shape = ({ shape, isSelected, showAnnotation, onDoubleClick, onAnnotationChange, onAnnotationBlur }) => {
  const [text, setText] = useState(shape.text || shape.annotation || '');

  const renderShape = () => {
    const { type, x1, y1, x2, y2 } = shape;
    const style = {
      position: 'absolute',
      border: isSelected ? '2px dashed red' : '1px solid black',
      pointerEvents: 'none',
      backgroundColor: 'transparent'
    };

    switch (type) {
      case 'line':
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        return (
          <div
            style={{
              ...style,
              left: x1,
              top: y1,
              width: length,
              height: 0,
              borderTop: '1px solid white',
              transform: `rotate(${angle}deg)`,
              transformOrigin: '0 0'
            }}
          />
        );
      case 'rectangle':
        return (
          <div
            style={{
              ...style,
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1),
              height: Math.abs(y2 - y1),
              backgroundColor: 'transparent',
              border: isSelected ? '2px dashed white' : '1px solid white'
            }}
          />
        );
      case 'circle':
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
        
        return (
          <div
            style={{
              ...style,
              left: centerX - radius,
              top: centerY - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: isSelected ? '2px dashed white' : '1px solid white'
            }}
          />
        );
      case 'text':
        return (
          <div
            style={{
              position: 'absolute',
              left: shape.x,
              top: shape.y,
              border: isSelected ? '2px dashed white' : 'none',
              padding: '2px',
              cursor: 'text',
              backgroundColor: isSelected ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
              minWidth: '100px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              color: 'white'
            }}
          >
            {shape.isEditing ? (
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={() => {
                  onAnnotationChange(text);
                  onAnnotationBlur();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onAnnotationBlur();
                  }
                }}
                autoFocus
                style={{
                  width: '100%',
                  border: '1px solid #ccc',
                  padding: '2px'
                }}
              />
            ) : (
              <span>{text}</span>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="shape-container" 
      onDoubleClick={onDoubleClick}
      style={{ position: 'absolute' }}
    >
      {renderShape()}
      {showAnnotation && shape.type !== 'text' && (
        <div 
          className="annotation" 
          style={{ 
            position: 'absolute', 
            left: Math.min(shape.x1, shape.x2), 
            top: Math.min(shape.y1, shape.y2) - 20 
          }}
        >
          {shape.isEditing ? (
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => {
                onAnnotationChange(text);
                onAnnotationBlur();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAnnotationBlur();
                }
              }}
              autoFocus
              style={{ fontSize: '12px', width: '100px' }}
            />
          ) : (
            <span>{shape.annotation}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Shape;