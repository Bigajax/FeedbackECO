import { useRef, useEffect, useCallback } from 'react';

type AnimationFrameCallback = (deltaTime: number) => void;

export const useAnimationFrame = (callback: AnimationFrameCallback) => {
  // Use refs for values that we want to persist between renders
  // without causing a re-render when they change
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const callbackRef = useRef<AnimationFrameCallback>(callback);

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Setup the animation loop
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  // Start the animation loop when the component mounts
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up the animation loop when the component unmounts
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

export default useAnimationFrame;