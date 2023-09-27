import { Engine, Render, Runner, Bodies, World } from "matter-js";

export const setupEngine = (
  containerRef: React.RefObject<HTMLDivElement>,
  windowSize: { width: number; height: number },
  setEngine: React.Dispatch<React.SetStateAction<Matter.Engine | null>>
) => {
  const engine = Engine.create();

  setEngine(engine);

  const render = Render.create({
    element: containerRef.current!,
    engine: engine,
    options: {
      wireframes: false,
      width: windowSize.width,
      height: windowSize.height,
      background: "black",
    },
  });

  const ground = Bodies.rectangle(
    windowSize.width / 2,
    windowSize.height,
    windowSize.width,
    50,
    {
      density: 1,
      isStatic: true,
    }
  );

  const leftWall = Bodies.rectangle(
    0,
    windowSize.height / 2,
    50,
    windowSize.height,
    {
      density: 1,
      isStatic: true,
    }
  );

  const rightWall = Bodies.rectangle(
    windowSize.width,
    windowSize.height / 2,
    50,
    windowSize.height,
    {
      density: 1,
      isStatic: true,
    }
  );

  const ceiling = Bodies.rectangle(
    windowSize.width / 2,
    -500,
    windowSize.width,
    50,
    {
      density: 1,
      isStatic: true,
    }
  );

  World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);
};
