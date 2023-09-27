import { useState, useEffect } from "react";
import { Events } from "matter-js";

export const useScore = (engine: Matter.Engine | null) => {
  const [score, setScore] = useState(0);

  const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
    event.pairs.forEach((pair) => {
      if (
        (pair.bodyA.label === "hoop" && pair.bodyB.label.startsWith("ball")) ||
        (pair.bodyB.label === "hoop" && pair.bodyA.label.startsWith("ball"))
      ) {
        setScore((prevScore) => prevScore + 1);
      }
    });
  };

  useEffect(() => {
    if (engine) {
      Events.on(engine, "collisionStart", handleCollision);
    }
    return () => {
      if (engine) {
        Events.off(engine, "collisionStart", handleCollision);
      }
    };
  }, [engine]);

  return { score, setScore };
};
