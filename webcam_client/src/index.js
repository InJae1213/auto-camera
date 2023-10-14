import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import WebcamApp from './WebcamApp';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const cocoObjects = [
    "person", "bicycle", "car", "motorcycle", "airplane", "bus", "train", "truck", "boat", "traffic light",
    "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat", "dog", "horse", "sheep", "cow",
    "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella", "handbag", "tie", "suitcase", "frisbee",
    "skis", "snowboard", "sports ball", "kite", "baseball bat", "baseball glove", "skateboard", "surfboard", 
    "tennis racket", "bottle", "wine glass", "cup", "fork", "knife", "spoon", "bowl", "banana", "apple",
    "sandwich", "orange", "broccoli", "carrot", "hot dog", "pizza", "donut", "cake", "chair", "couch",
    "potted plant", "bed", "dining table", "toilet", "tv", "laptop", "mouse", "remote", "keyboard", 
    "cell phone", "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", 
    "scissors", "teddy bear", "hair drier", "toothbrush"
];

function App() {
  const [selectedObject, setSelectedObject] = useState('dog');
  const [objectCount, setObjectCount] = useState(1);
  const [shootingInterval, setShootingInterval] = useState(1);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <h1>Auto-Camera</h1>
            <div>
              <label htmlFor="objectSelect">촬영할 객체를 선택하세요!</label>
              <select 
                id="objectSelect" 
                name="objectSelect" 
                value={selectedObject} 
                onChange={(e) => setSelectedObject(e.target.value)}
              >
                {cocoObjects.map(obj => <option key={obj} value={obj}>{obj.charAt(0).toUpperCase() + obj.slice(1)}</option>)}
              </select>
              <label htmlFor="objectCount">객체 수를 선택하세요!</label>
              <input 
                type="number" 
                id="objectCount" 
                name="objectCount" 
                min="1" 
                max="10" 
                value={objectCount} 
                onChange={(e) => setObjectCount(e.target.value)}
              />
              <label htmlFor="shootingInterval">촬영간격(초)을 선택하세요!</label>
              <input 
                type="number" 
                id="shootingInterval" 
                name="shootingInterval" 
                min="0.1" 
                max="60" 
                value={shootingInterval} 
                onChange={(e) => setShootingInterval(e.target.value)}
              />
              <br />
              <div style={{ width: '80%', textAlign: 'center' }}> {/* 가운데 정렬을 위한 div 추가 */}
                <Link className="LinkButton" to="/webcam">세팅 완료!</Link>
              </div>
            </div>
          </div>
        } index />
        <Route path="/webcam" element={
          <div>
            <WebcamApp 
              selectedObject={selectedObject} 
              objectCount={parseInt(objectCount, 10)} 
              shootingInterval={parseInt(shootingInterval, 10)}
            />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link className="LinkButton" to="/">돌아가기</Link>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);