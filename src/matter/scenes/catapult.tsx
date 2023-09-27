import Matter, { World } from "matter-js";
import { useRef, useEffect, useState } from "react";

export function CatapultDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Vector = Matter.Vector;

      // Create engine
      const engine = Engine.create(),
        world = engine.world;

      // Create renderer
      const render = Render.create({
        element: containerRef.current,
        engine: engine,
        options: {
          width: windowSize.width,
          height: windowSize.height,
          showAngleIndicator: true,
          showCollisions: true,
          showVelocity: true,
          background: "black",
        },
      });

      Render.run(render);

      // Create runner
      const runner = Runner.create();
      Runner.run(runner, engine);

      // Add bodies
      const group = Body.nextGroup(true);

      const stack = Composites.stack(
        250,
        255,
        1,
        6,
        0,
        0,
        function (x: number, y: number) {
          return Bodies.rectangle(x, y, 30, 30);
        }
      );

      const catapult = Bodies.rectangle(400, 520, 320, 20, {
        collisionFilter: { group: group },
      });

      Composite.add(world, [
        stack,
        catapult,
        Bodies.rectangle(400, windowSize.height, windowSize.width, 50.5, {
          isStatic: true,
        }),
        Bodies.rectangle(250, 555, 20, 50, { isStatic: true }),
        Bodies.rectangle(400, 535, 20, 80, {
          isStatic: true,
          collisionFilter: { group: group },
        }),
        Bodies.circle(560, 100, 50, { density: 0.005 }),
        Constraint.create({
          bodyA: catapult,
          pointB: Vector.clone(catapult.position),
          stiffness: 1,
          length: 0,
        }),
      ]);

      // Add mouse control
      const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2,
            render: {
              visible: false,
            },
          },
        });

      Composite.add(world, mouseConstraint);

      // Keep the mouse in sync with rendering
      render.mouse = mouse;

      return () => {
        Render.stop(render);
        Runner.stop(runner);
        World.clear(engine.world, false);
      };
    }
  }, [containerRef, windowSize]);

  return (
    <div
      ref={containerRef}
      id="matter-container"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
