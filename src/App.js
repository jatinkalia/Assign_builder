import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import DrawingArea from './components/DrawingArea';
import './styles.css';

function App() {
  const [tool, setTool] = useState('select');
  const [shapes, setShapes] = useState([]);
  const [showAnnotations, setShowAnnotations] = useState(true);

  return (
    <div className="app">
      <Toolbar 
        currentTool={tool} 
        setTool={setTool}
        showAnnotations={showAnnotations}
        setShowAnnotations={setShowAnnotations}
      />
      <DrawingArea 
        tool={tool}
        shapes={shapes}
        setShapes={setShapes}
        showAnnotations={showAnnotations}
      />
    </div>
  );
}

export default App;