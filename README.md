# Emotion Recognition Web Application

## Project Overview
This is an emotion recognition web application that uses machine learning algorithms to analyze facial expressions and classify them into various emotions.

<img width="1358" height="610" alt="innerglow" src="https://github.com/user-attachments/assets/e242e267-666d-429e-a297-787a900f6a66" />

## Link
https://emotion-compass.vercel.app/

## Features
- Real-time emotion detection
- User-friendly interface
- Supports multiple emotions like happiness, sadness, anger, surprise, and more.
- Option to upload images for analysis
- API support for integration with other applications

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Machine Learning Framework:** TensorFlow
- **Database:** MongoDB
- **Deployment:** Vercel and render

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/HibaRaliyyah/emotion-recognition.git
   ```
2. Change into the project directory:
   ```bash
   cd emotion-recognition
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Usage
- Open your browser and navigate to `http://localhost:3000` to access the application.
- Follow the on-screen instructions to upload images or use the webcam to test emotion recognition.

## API Endpoints
- **POST /api/analyze**: Analyze an image for emotion detection.
  - Request Body: Image file
  - Response: Detected emotion

- **GET /api/emotions**: Retrieve list of supported emotions.
