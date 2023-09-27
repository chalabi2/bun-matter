import { Bodies, World } from "matter-js";

export const addNewBall = (engine: Matter.Engine | null) => {
  if (engine) {
    const newBall = Bodies.circle(100, 100, 35, {
      restitution: 0.8,
      friction: 0.005,
      density: 0.04,
      label: "ball",
      render: {
        fillStyle: "orange",
        sprite: {
          texture: "/120px-Basketball.png",
          xScale: 1,
          yScale: 1,
        },
      },
    });
    World.add(engine.world, [newBall]);
  }
};

export const ballPassedThroughHoop = (
  event: Matter.IEventCollision<Matter.Engine>,
  setScore: React.Dispatch<React.SetStateAction<number>>
) => {
  event.pairs.forEach((pair) => {
    if (
      (pair.bodyA.label === "hoop" && pair.bodyB.label.startsWith("ball")) ||
      (pair.bodyB.label === "hoop" && pair.bodyA.label.startsWith("ball"))
    ) {
      setScore((prevScore) => prevScore + 1);
    }
  });
};
