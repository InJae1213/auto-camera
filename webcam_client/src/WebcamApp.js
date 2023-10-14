import React, { useRef, useEffect, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

function WebcamApp({ selectedObject, objectCount, shootingInterval }) {
    const webcamRef = useRef(null);
    const [indicatorColor, setIndicatorColor] = useState('red');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [detectedCount, setDetectedCount] = useState(0); // 실시간 객체 인식 피드백을 위한 state 추가

    const saveImageFunction = useCallback(() => {
        const link = document.createElement('a');
        link.href = webcamRef.current.getScreenshot();
        link.download = `capture_${Date.now()}.jpg`;
        link.click();
    }, [webcamRef]);

    const sendImageToServer = useCallback(async () => {
        if (!webcamRef.current) {
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        const formData = new FormData();
        formData.append('image', imageSrc);

        try {
            let response = await fetch("http://localhost:5000/detect", {
                method: "POST",
                body: formData
            });
            let data = await response.json();
            const detectedObjects = data.detected_objects;
            const objectOccurrences = detectedObjects.filter(obj => obj === selectedObject).length;
            setDetectedCount(objectOccurrences); // 실시간 객체 인식 피드백 업데이트
            if (objectOccurrences >= objectCount) {
                saveImageFunction();
                setIndicatorColor('green');
            } else {
                setIndicatorColor('red');
            }
        } catch (error) {
            console.error("Error sending image to server: ", error);
        }
    }, [selectedObject, objectCount, saveImageFunction]);

    useEffect(() => {
        const interval = setInterval(() => {
            sendImageToServer();
        }, shootingInterval * 1000);

        return () => clearInterval(interval);
    }, [shootingInterval, sendImageToServer]);

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
            <p style={{ textAlign: 'center' }}>Detected {selectedObject}s: {detectedCount}</p> {/* 실시간 객체 인식 피드백 표시 */}
        </div>
    );
}

export default WebcamApp;