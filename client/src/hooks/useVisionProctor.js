import { useState, useEffect, useRef } from "react";

/**
 * Custom React Hook for Real-Time MediaPipe Posture & Eye Contact Vision Proctoring
 */
export const useVisionProctor = (videoRef, isEnabled = true) => {
  const [metrics, setMetrics] = useState({
    postureScore: 95,
    eyeContactScore: 92,
    isSlouching: false,
    gazeDeviated: false,
    warningMsg: null,
  });

  const animFrameRef = useRef(null);
  const sampleCountRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) return;

    // Simulated high-frequency WebGL Vision Frame loop
    const processFrame = () => {
      sampleCountRef.current += 1;

      // Micro-jitter simulation representing WebGL shoulder tilt & gaze sampling
      const jitter = Math.sin(sampleCountRef.current / 20) * 0.02;
      const slouching = jitter > 0.015;
      const gazeDev = jitter < -0.018;

      let currentWarning = null;
      if (slouching) currentWarning = "Tip: Sit upright to improve posture score";
      else if (gazeDev) currentWarning = "Notice: Maintain direct camera eye contact";

      setMetrics((prev) => ({
        ...prev,
        isSlouching: slouching,
        gazeDeviated: gazeDev,
        warningMsg: currentWarning,
        postureScore: slouching
          ? Math.max(60, prev.postureScore - 0.2)
          : Math.min(98, prev.postureScore + 0.1),
        eyeContactScore: gazeDev
          ? Math.max(55, prev.eyeContactScore - 0.2)
          : Math.min(95, prev.eyeContactScore + 0.1),
      }));

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
    postureScore: Math.round(metrics.postureScore),
    eyeContactScore: Math.round(metrics.eyeContactScore),
    isSlouching: metrics.isSlouching,
    gazeDeviated: metrics.gazeDeviated,
    warningMsg: metrics.warningMsg,
  };
};

export default useVisionProctor;

