import React, { useState, useRef, useEffect } from 'react';
import Shape from './Shape';

const DrawingArea = ({ tool, shapes, setShapes, showAnnotations }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const canvasRef = useRef(null);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (tool === 'select') {
      const clickedShape = [...shapes].reverse().find(shape => 
        isPointInShape({ x, y }, shape)
      );
      setSelectedShapeId(clickedShape?.id || null);
      return;
    }

    if (tool === 'text') {
      const newText = {
        id: Date.now(),
        type: 'text',
        x: x,
        y: y,
        text: 'Select then double click to edit',
        isEditing: true,
        annotation: ''
      };
      setShapes([...shapes, newText]);
      return;
    }

    setIsDrawing(true);
    setStartPoint({ x, y });
    
    const newShape = {
      id: Date.now(),
      type: tool,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      annotation: '',
      isEditing: false
    };
    
    setCurrentShape(newShape);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !currentShape) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentShape({
      ...currentShape,
      x2: x,
      y2: y
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentShape) return;
    
    setIsDrawing(false);
    
    if (currentShape.x1 !== currentShape.x2 || currentShape.y1 !== currentShape.y2) {
      setShapes([...shapes, currentShape]);
    }
    
    setCurrentShape(null);
  };

  const isPointInShape = (point, shape) => {
    switch (shape.type) {
      case 'line':
        return isPointNearLine(point, shape);
      case 'rectangle':
        return isPointInRectangle(point, shape);
      case 'circle':
        return isPointInCircle(point, shape);
      case 'text':
        return (
          point.x >= shape.x - 5 && 
          point.x <= shape.x + 100 && 
          point.y >= shape.y - 5 && 
          point.y <= shape.y + 20
        );
      default:
        return false;
    }
  };

  const isPointNearLine = (point, line) => {
    const { x1, y1, x2, y2 } = line;
    const distance = distanceToLine(point, { x: x1, y: y1 }, { x: x2, y: y2 });
    return distance < 5;
  };

  const distanceToLine = (point, lineStart, lineEnd) => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const isPointInRectangle = (point, rect) => {
    const left = Math.min(rect.x1, rect.x2);
    const right = Math.max(rect.x1, rect.x2);
    const top = Math.min(rect.y1, rect.y2);
    const bottom = Math.max(rect.y1, rect.y2);
    
    return point.x >= left - 5 && point.x <= right + 5 && 
           point.y >= top - 5 && point.y <= bottom + 5;
  };

  const isPointInCircle = (point, circle) => {
    const centerX = (circle.x1 + circle.x2) / 2;
    const centerY = (circle.y1 + circle.y2) / 2;
    const radius = Math.sqrt(
      Math.pow(circle.x2 - circle.x1, 2) + 
      Math.pow(circle.y2 - circle.y1, 2)
    ) / 2;
    
    const distance = Math.sqrt(
      Math.pow(point.x - centerX, 2) + 
      Math.pow(point.y - centerY, 2)
    );
    
    return distance <= radius + 5;
  };

  const handleShapeDoubleClick = (shapeId) => {
    setShapes(shapes.map(shape => 
      shape.id === shapeId ? { ...shape, isEditing: true } : shape
    ));
  };

  const handleAnnotationChange = (shapeId, text) => {
    setShapes(shapes.map(shape => 
      shape.id === shapeId ? { ...shape, annotation: text, text: text } : shape
    ));
  };

  const handleAnnotationBlur = (shapeId) => {
    setShapes(shapes.map(shape => 
      shape.id === shapeId ? { ...shape, isEditing: false } : shape
    ));
  };

  const deleteSelectedShape = () => {
    if (selectedShapeId) {
      setShapes(shapes.filter(shape => shape.id !== selectedShapeId));
      setSelectedShapeId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedShapeId) {
        deleteSelectedShape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, shapes]);

  return (
    <div className="drawing-area-container">
      <div 
        className="drawing-area" 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {shapes.map(shape => (
          <Shape
            key={shape.id}
            shape={shape}
            isSelected={shape.id === selectedShapeId}
            showAnnotation={showAnnotations}
            onDoubleClick={() => handleShapeDoubleClick(shape.id)}
            onAnnotationChange={(text) => handleAnnotationChange(shape.id, text)}
            onAnnotationBlur={() => handleAnnotationBlur(shape.id)}
          />
        ))}
        {currentShape && (
          <Shape
            shape={currentShape}
            isSelected={false}
            showAnnotation={false}
          />
        )}
      </div>
    </div>
  );
};

export default DrawingArea;