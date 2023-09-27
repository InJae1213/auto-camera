from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# YOLO Configurations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
YOLO_CFG = os.path.join(BASE_DIR, "webcam_server/yolov4-tiny.cfg")
YOLO_WEIGHTS = os.path.join(BASE_DIR, "webcam_server/yolov4-tiny.weights")
YOLO_CLASSES = os.path.join(BASE_DIR, "webcam_server/coco.names")
CONFIDENCE_THRESHOLD = 0.5  # adjust to your needs
NMS_THRESHOLD = 0.4  # adjust to your needs

net = cv2.dnn.readNet(YOLO_WEIGHTS, YOLO_CFG)
layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers().flatten()]
classes = open(YOLO_CLASSES).read().strip().split("\n")

def detect_objects(image):
    height, width, channels = image.shape
    blob = cv2.dnn.blobFromImage(image, 0.00392, (416, 416), (0, 0, 0), True, crop=False)
    net.setInput(blob)
    outs = net.forward(output_layers)

    class_ids = []
    confidences = []
    boxes = []

    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > CONFIDENCE_THRESHOLD:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)
                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    detected_objects = []
    indexes = cv2.dnn.NMSBoxes(boxes, confidences, CONFIDENCE_THRESHOLD, NMS_THRESHOLD)
    for i in range(len(boxes)):
        if i in indexes:
            detected_objects.append(classes[class_ids[i]])

    return detected_objects

@app.route('/detect', methods=['POST'])
def detect():
    image_data = request.form.get("image")
    if not image_data:
        return jsonify(error="no image provided"), 400

    try:
        # Decode the base64 image
        image_data = base64.b64decode(image_data.split(",")[1])
        image = cv2.imdecode(np.frombuffer(image_data, dtype=np.uint8), cv2.IMREAD_COLOR)
        detected_objects = detect_objects(image)
        return jsonify(detected_objects=detected_objects)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
