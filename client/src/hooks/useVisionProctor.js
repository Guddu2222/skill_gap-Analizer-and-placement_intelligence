import { useState, useEffect, useRef } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";

/**
 * Custom React Hook for Real-Time MediaPipe AI Posture & Eye Contact Vision Proctoring
 */
export const useVisionProctor = (videoRef, isEnabled = true) => {
  const [metrics, setMetrics] = useState({
    hasCandidate: false,
    multiplePersonsDetected: false,
    postureScore: 0,
    eyeContactScore: 0,
    isSlouching: false,
    gazeDeviated: false,
    warningMsg: "Initializing MediaPipe Vision Proctor...",
    isReady: false,
  });

  const landmarkerRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // Initialize MediaPipe FaceLandmarker
  useEffect(() => {
    if (!isEnabled) return;

    let isMounted = true;

    const initMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );

        if (!isMounted) return;

        let landmarker;
        try {
          // Attempt GPU delegate first
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numFaces: 2,
          });
        } catch (gpuErr) {
          console.warn("MediaPipe GPU delegate failed, falling back to CPU:", gpuErr);
          landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numFaces: 2,
          });
        }

        if (isMounted) {
          landmarkerRef.current = landmarker;
          setMetrics((prev) => ({
            ...prev,
            isReady: true,
            warningMsg: "Align face in camera view",
          }));
        }
      } catch (err) {
        console.error("Failed to load MediaPipe Vision models:", err);
        if (isMounted) {
          setMetrics((prev) => ({
            ...prev,
            warningMsg: "Failed to initialize MediaPipe Vision AI engine",
          }));
        }
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      if (landmarkerRef.current) {
        try {
          landmarkerRef.current.close();
        } catch (e) {
          // Ignore close cleanup errors
        }
        landmarkerRef.current = null;
      }
    };
  }, [isEnabled]);

  // Real-time WebGL Frame Detection Loop
  useEffect(() => {
    if (!isEnabled) return;

    const processFrame = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;

      if (
        video &&
        video.readyState >= 2 &&
        video.currentTime !== lastVideoTimeRef.current &&
        landmarker
      ) {
        lastVideoTimeRef.current = video.currentTime;
        const startTimeMs = performance.now();
        const results = landmarker.detectForVideo(video, startTimeMs);

        if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
          // NO CANDIDATE DETECTED IN CAMERA FEED
          setMetrics((prev) => ({
            ...prev,
            hasCandidate: false,
            multiplePersonsDetected: false,
            isSlouching: true,
            gazeDeviated: true,
            warningMsg: "ALERT: No candidate detected in webcam feed!",
            postureScore: Math.max(0, Math.round(prev.postureScore * 0.8)),
            eyeContactScore: Math.max(0, Math.round(prev.eyeContactScore * 0.8)),
          }));
        } else if (results.faceLandmarks.length > 1) {
          // MULTIPLE PERSONS DETECTED (PROCTORING VIOLATION)
          setMetrics((prev) => ({
            ...prev,
            hasCandidate: true,
            multiplePersonsDetected: true,
            isSlouching: true,
            gazeDeviated: true,
            warningMsg: "ALERT: Multiple persons detected in camera feed!",
            postureScore: Math.max(0, Math.round(prev.postureScore * 0.8)),
            eyeContactScore: Math.max(0, Math.round(prev.eyeContactScore * 0.8)),
          }));
        } else {
          // EXACTLY ONE CANDIDATE PRESENT - EVALUATE LANDMARKS
          const landmarks = results.faceLandmarks[0];

          // Landmark Keypoints:
          // 1: Nose Tip
          // 234: Left Cheek/Ear Edge
          // 454: Right Cheek/Ear Edge
          const nose = landmarks[1];
          const leftCheek = landmarks[234];
          const rightCheek = landmarks[454];

          // Face Yaw (Head rotation sideways)
          const cheekMidX = (leftCheek.x + rightCheek.x) / 2;
          const yawOffset = Math.abs(nose.x - cheekMidX); // > 0.055 indicates turned head

          // Posture Analysis (Y elevation & head drop)
          const headDropped = nose.y > 0.65; // Slouching low
          const headTooHigh = nose.y < 0.15; // Tilted back
          const headTurned = yawOffset > 0.055;

          const isSlouching = headDropped || headTooHigh || headTurned;

          let targetPosture = 98;
          if (headDropped) targetPosture -= 35;
          if (headTooHigh) targetPosture -= 25;
          if (headTurned) targetPosture -= (yawOffset - 0.055) * 450;
          targetPosture = Math.max(15, Math.min(98, targetPosture));

          // Eye Contact Analysis (Screen center alignment & yaw)
          const gazeDeviated = headTurned || Math.abs(nose.x - 0.5) > 0.22;

          let targetEyeContact = 95;
          if (gazeDeviated) {
            targetEyeContact = Math.max(
              10,
              95 - yawOffset * 500 - Math.abs(nose.x - 0.5) * 150
            );
          }

          let currentWarning = null;
          if (isSlouching && !gazeDeviated) {
            currentWarning = "Tip: Sit upright to improve posture score";
          } else if (gazeDeviated) {
            currentWarning = "Notice: Maintain direct camera eye contact";
          }

          setMetrics((prev) => ({
            ...prev,
            hasCandidate: true,
            multiplePersonsDetected: false,
            isSlouching,
            gazeDeviated,
            warningMsg: currentWarning,
            // Smooth EMA updates
            postureScore: Math.round(prev.postureScore * 0.7 + targetPosture * 0.3),
            eyeContactScore: Math.round(
              prev.eyeContactScore * 0.7 + targetEyeContact * 0.3
            ),
          }));
        }
      } else if (!video || video.readyState < 2) {
        // Video feed paused/disabled
        setMetrics((prev) => ({
          ...prev,
          hasCandidate: false,
          multiplePersonsDetected: false,
          warningMsg: prev.isReady ? "Webcam feed inactive" : prev.warningMsg,
        }));
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isEnabled]);

  return {
    hasCandidate: metrics.hasCandidate,
    multiplePersonsDetected: metrics.multiplePersonsDetected,
    postureScore: metrics.postureScore,
    eyeContactScore: metrics.eyeContactScore,
    isSlouching: metrics.isSlouching,
    gazeDeviated: metrics.gazeDeviated,
    warningMsg: metrics.warningMsg,
    isReady: metrics.isReady,
  };
};

export default useVisionProctor;


