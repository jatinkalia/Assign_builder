import React from 'react';

const Toolbar = ({ currentTool, setTool, showAnnotations, setShowAnnotations }) => {
  return (
    <div className="toolbar">
      <h2>Drawing Tools</h2>
      <div className="tools">
        <button 
          className={currentTool === 'select' ? 'active' : ''}
          onClick={() => setTool('select')}
        >
          Select
        </button>
        <button 
          className={currentTool === 'line' ? 'active' : ''}
          onClick={() => setTool('line')}
        >
          Line
        </button>
        <button 
          className={currentTool === 'rectangle' ? 'active' : ''}
          onClick={() => setTool('rectangle')}
        >
          Rectangle
        </button>
        <button 
          className={currentTool === 'circle' ? 'active' : ''}
          onClick={() => setTool('circle')}
        >
          Circle
        </button>
        <button 
          className={currentTool === 'text' ? 'active' : ''}
          onClick={() => setTool('text')}
        >
          Text
        </button>
      </div>
      <div className="view-options">
        <label>
          <input 
            type="checkbox" 
            checked={showAnnotations}
            onChange={() => setShowAnnotations(!showAnnotations)}
          />
          Show Annotations
        </label>
      </div>
    </div>
  );
};

export default Toolbar;