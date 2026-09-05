import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const CHECK_INTERVAL_MS = 500;
const VIOLATION_AFTER_MS = 2500;

function averagePoint(landmarks, indices) {
  return indices.reduce(
    (sum, index) => ({ x: sum.x + landmarks[index].x, y: sum.y + landmarks[index].y }),
    { x: 0, y: 0 }
  );
}

function eyeGazeDirection(landmarks) {
  // MediaPipe's iris groups are 468-472 (left) and 473-477 (right).
  // The surrounding eye landmarks provide a normalized iris position that is
  // more stable than raw pixel coordinates across different camera distances.
  const leftIris = landmarks[468];
  const rightIris = landmarks[473];
  if (!leftIris || !rightIris) return "unavailable";

  const eyes = [
    { iris: leftIris, corners: [33, 133], top: [159, 160], bottom: [145, 144] },
    { iris: rightIris, corners: [362, 263], top: [386, 385], bottom: [374, 380] },
  ];
  const horizontalRatios = [];
  const verticalOpenings = [];

  for (const eye of eyes) {
    const corners = eye.corners.map((index) => landmarks[index]);
    const top = averagePoint(landmarks, eye.top);
    const bottom = averagePoint(landmarks, eye.bottom);
    const minX = Math.min(corners[0].x, corners[1].x);
    const maxX = Math.max(corners[0].x, corners[1].x);
    const width = Math.max(maxX - minX, 0.01);
    horizontalRatios.push((eye.iris.x - minX) / width);
    verticalOpenings.push(Math.abs(bottom.y / eye.bottom.length - top.y / eye.top.length) / width);
  }

  const averageHorizontal = (horizontalRatios[0] + horizontalRatios[1]) / 2;
  const averageOpening = (verticalOpenings[0] + verticalOpenings[1]) / 2;
  if (averageOpening < 0.12) return "eyes-closed";
  if (averageHorizontal < 0.28) return "left";
  if (averageHorizontal > 0.72) return "right";
  return null;
}

export default function useCameraProctoring({ active, onViolation }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const violationStartedRef = useRef({});
  const violationReportedRef = useRef({});
  const onViolationRef = useRef(onViolation);
  const [status, setStatus] = useState("inactive");
  const [cameraError, setCameraError] = useState("");
  const [direction, setDirection] = useState(null);

  onViolationRef.current = onViolation;

  useEffect(() => {
    if (!active) {
      setStatus("inactive");
      setDirection(null);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      landmarkerRef.current?.close?.();
      landmarkerRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      return undefined;
    }

    let cancelled = false;

    const reportSustainedViolation = (reason, now) => {
      if (!violationStartedRef.current[reason]) violationStartedRef.current[reason] = now;
      if (
        now - violationStartedRef.current[reason] >= VIOLATION_AFTER_MS &&
        !violationReportedRef.current[reason]
      ) {
        violationReportedRef.current[reason] = true;
        onViolationRef.current(reason);
      }
    };

    const clearViolation = (reason) => {
      delete violationStartedRef.current[reason];
      delete violationReportedRef.current[reason];
    };

    const monitor = () => {
      if (cancelled || !landmarkerRef.current || !videoRef.current || videoRef.current.readyState < 2) {
        if (!cancelled) animationRef.current = requestAnimationFrame(monitor);
        return;
      }

      const now = performance.now();
      const result = landmarkerRef.current.detectForVideo(videoRef.current, now);
      const faces = result.faceLandmarks || [];

      if (faces.length === 0) {
        setDirection("missing");
        reportSustainedViolation("camera-missing", now);
        clearViolation("multiple-faces");
        clearViolation("eye-gaze");
      } else if (faces.length > 1) {
        setDirection("multiple");
        reportSustainedViolation("multiple-faces", now);
        clearViolation("camera-missing");
        clearViolation("eye-gaze");
      } else {
        const detectedDirection = eyeGazeDirection(faces[0]);
        setDirection(detectedDirection);
        clearViolation("camera-missing");
        clearViolation("multiple-faces");
        if (detectedDirection && detectedDirection !== "unavailable") {
          reportSustainedViolation("eye-gaze", now);
        } else {
          clearViolation("eye-gaze");
        }
      }

      animationRef.current = window.setTimeout(() => {
        animationRef.current = requestAnimationFrame(monitor);
      }, CHECK_INTERVAL_MS);
    };

    const start = async () => {
      let stream;
      try {
        setStatus("loading");
        setCameraError("");
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        } catch (error) {
          const messages = {
            NotAllowedError: "Camera permission was denied. Allow camera access for this site and reload the test.",
            PermissionDeniedError: "Camera permission was denied. Allow camera access for this site and reload the test.",
            NotFoundError: "No camera was found. Connect a camera and reload the test.",
            NotReadableError: "The camera is being used by another application. Close it and reload the test.",
            SecurityError: "Camera access requires HTTPS or localhost. Open the test on a secure URL.",
          };
          throw new Error(messages[error.name] || "The browser could not open the camera. Check camera permissions and reload the test.");
        }
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const vision = await FilesetResolver.forVisionTasks(WASM_URL);
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
          runningMode: "VIDEO",
          numFaces: 2,
          minFaceDetectionConfidence: 0.6,
          minFacePresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        setStatus("active");
        animationRef.current = requestAnimationFrame(monitor);
      } catch (error) {
        console.error("Camera proctoring could not start:", error);
        setStatus("blocked");
        setCameraError(error.message || "Camera monitoring could not start. Reload the test and try again.");
      }
    };

    start();
    return () => {
      cancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      landmarkerRef.current?.close?.();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      landmarkerRef.current = null;
      streamRef.current = null;
    };
  }, [active]);

  return { videoRef, status, cameraError, direction };
}