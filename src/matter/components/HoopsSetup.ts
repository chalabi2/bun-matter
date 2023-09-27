import { Bodies } from "matter-js";

export const setupHoop = (windowSize: { width: number; height: number }) => {
  const hoopPole = Bodies.rectangle(
    windowSize.width - 200,
    windowSize.height - 225,
    40,
    1800,
    { isStatic: true }
  );

  const hoop = Bodies.rectangle(
    windowSize.width - 365,
    windowSize.height - 800,
    275,
    35,
    {
      isStatic: true,
      isSensor: true, // Allow the ball to pass through
      label: "hoop",
      render: {
        strokeStyle: "white",
        fillStyle: "transparent",
        lineWidth: 5,
      },
    }
  );

  const hoopConstrant = Bodies.rectangle(
    windowSize.width - 510,
    windowSize.height - 800,
    5,
    35,
    {
      isStatic: true,
      label: "hoop",
      render: {
        strokeStyle: "transparent",
        fillStyle: "transparent",
        lineWidth: 5,
      },
    }
  );

  return [hoopPole, hoop, hoopConstrant];
};
