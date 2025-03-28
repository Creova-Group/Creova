import { useState, useEffect } from "react";

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== "undefined") {
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  return windowDimensions;
};