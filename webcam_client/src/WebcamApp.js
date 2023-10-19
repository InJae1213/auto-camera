import React, { useRef, useEffect, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

// 웹캠 앱 컴포넌트
function WebcamApp({ selectedObject, objectCount, shootingInterval, detectionMode }) {
    // 웹캠 참조 설정
    const webcamRef = useRef(null);
    // 촬영 상태 표시 (빨간색: 촬영 중, 초록색: 촬영 완료)
    const [indicatorColor, setIndicatorColor] = useState('red');
    // 인터넷 연결 상태 확인
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    // 감지된 객체 수
    const [detectedCount, setDetectedCount] = useState(0);
    // 서버 요청 진행 상태
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);

    // 이미지 저장 함수
    const saveImageFunction = useCallback(() => {
        const link = document.createElement('a');
        link.href = webcamRef.current.getScreenshot();
        link.download = `capture_${Date.now()}.jpg`;
        link.click();
    }, [webcamRef]);

    // 서버에 이미지 전송 및 객체 감지 함수
    const sendImageToServer = useCallback(async () => {
        if (!webcamRef.current || isRequestInProgress) {
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            return;
        }

        setIsRequestInProgress(true);

        const formData = new FormData();
        formData.append('image', imageSrc);

        try {
            let response = await fetch("http://192.168.0.5:5000/detect", {
                method: "POST",
                body: formData
            });
            let data = await response.json();
            const detectedObjects = data.detected_objects;
            const objectOccurrences = detectedObjects.filter(obj => obj === selectedObject).length;
            setDetectedCount(objectOccurrences);

            // 감지 모드에 따른 이미지 저장 조건
            if (detectionMode === "above" && objectOccurrences >= objectCount) {
                saveImageFunction();
                setIndicatorColor('green');
            } else if (detectionMode === "below" && objectOccurrences <= objectCount) {
                saveImageFunction();
                setIndicatorColor('green');
            } else if (detectionMode === "fix" && objectOccurrences === objectCount) {
                saveImageFunction();
                setIndicatorColor('green');
            } else {
                setIndicatorColor('red');
            }
        } catch (error) {
            console.error("Error sending image to server: ", error);
        } finally {
            setIsRequestInProgress(false);
        }
    }, [selectedObject, objectCount, detectionMode, saveImageFunction]);

    // 촬영 간격에 따른 이미지 전송 간격 설정
    useEffect(() => {
        const interval = setInterval(() => {
            sendImageToServer();
        }, shootingInterval * 1000);

        return () => clearInterval(interval);
    }, [shootingInterval, sendImageToServer]);

    // 인터넷 연결 상태 감지 이벤트 설정
    useEffect(() => {
        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));
        return () => {
            window.removeEventListener('online', () => setIsOnline(true));
            window.removeEventListener('offline', () => setIsOnline(false));
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <Webcam 
                ref={webcamRef} 
                screenshotFormat="image/jpeg"
                style={{ width: '100%', height: 'auto' }}
                videoConstraints={{ deviceId: 0, width: 800, height: 600 }}
            />
            <div style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', backgroundColor: indicatorColor }}></div>
            {!isOnline && <p style={{ color: 'red', textAlign: 'center' }}>No internet connection</p>}
            <p style={{ textAlign: 'center' }}>Detected {selectedObject}s: {detectedCount}</p>
        </div>
    );
}

export default WebcamApp;
