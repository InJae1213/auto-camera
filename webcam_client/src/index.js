import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import WebcamApp from './WebcamApp';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

// coco 데이터셋에서 사용되는 객체 목록
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

// 메인 앱 컴포넌트
function App() {
  // 선택된 객체 상태
  const [selectedObject, setSelectedObject] = useState('dog');
  // 선택된 객체 수 상태
  const [objectCount, setObjectCount] = useState(1);
  // 촬영 간격 상태
  const [shootingInterval, setShootingInterval] = useState(1);
  // 감지 모드 상태 (above, below, fix)
  const [detectionMode, setDetectionMode] = useState('above');

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <h1>Auto-Camera</h1>
            <div>
              {/* 객체 선택 드롭다운 */}
              <label htmlFor="objectSelect">촬영할 객체를 선택하세요!</label>
              <select 
                id="objectSelect" 
                name="objectSelect" 
                value={selectedObject} 
                onChange={(e) => setSelectedObject(e.target.value)}
              >
                {cocoObjects.map(obj => <option key={obj} value={obj}>{obj.charAt(0).toUpperCase() + obj.slice(1)}</option>)}
              </select>
              
              {/* 촬영 간격 선택 입력 */}
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
              
              {/* 객체 수 선택 입력 */}
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
              
              {/* 감지 모드 선택 라디오 버튼 */}
              <div>
                <label>
                  <input 
                    type="radio" 
                    value="above" 
                    checked={detectionMode === "above"} 
                    onChange={(e) => setDetectionMode(e.target.value)} 
                  />
                  이상
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="below" 
                    checked={detectionMode === "below"} 
                    onChange={(e) => setDetectionMode(e.target.value)} 
                  />
                  이하
                </label>
                <label>
                  <input 
                    type="radio" 
                    value="fix" 
                    checked={detectionMode === "fix"} 
                    onChange={(e) => setDetectionMode(e.target.value)} 
                  />
                  고정
                </label>
              </div>
              
              {/* 세팅 완료 버튼 */}
              <div style={{ width: '80%', textAlign: 'center' }}>
                <Link className="LinkButton" to="/webcam">세팅 완료!</Link>
              </div>
            </div>
          </div>
        } index />
        
        {/* 웹캠 라우트 */}
        <Route path="/webcam" element={
          <div>
            <WebcamApp 
              selectedObject={selectedObject} 
              objectCount={parseInt(objectCount, 10)} 
              shootingInterval={parseInt(shootingInterval, 10)}
              detectionMode={detectionMode}
            />
            {/* 돌아가기 버튼 */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link className="LinkButton" to="/">돌아가기</Link>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

// 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
