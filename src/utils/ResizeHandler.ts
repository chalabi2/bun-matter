import { useEffect } from "react";

export const useResizeHandler = (
  setWindowSize: React.Dispatch<
    React.SetStateAction<{ width: number; height: number }>
  >
) => {
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWindowSize]);
};
