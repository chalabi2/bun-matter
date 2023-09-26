import Matter from "matter-js";
import { useRef, useEffect, useState } from "react";

export function Demo() {
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
        Bodies = Matter.Bodies,
        World = Matter.World;

      const engine = Engine.create();

      const render = Render.create({
        element: containerRef.current,
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
        20,
        {
          density: 1,
          isStatic: true,
        }
      );
      const leftWall = Bodies.rectangle(
        0,
        windowSize.height / 2,
        20,
        windowSize.height,
        {
          density: 1,
          isStatic: true,
        }
      );
      const rightWall = Bodies.rectangle(
        windowSize.width,
        windowSize.height / 2,
        20,
        windowSize.height,
        {
          density: 1,
          isStatic: true,
        }
      );
      const ceiling = Bodies.rectangle(
        windowSize.width / 2,
        0,
        windowSize.width,
        20,
        {
          density: 1,
          isStatic: true,
        }
      );

      // Creating a bouncy ball
      const ball = Bodies.circle(100, 100, 20, {
        restitution: 0.8, // makes the ball bouncy
        friction: 0.005, // adjusts friction to prevent it from breaking through walls
        density: 0.04, // adjusts density
        render: { fillStyle: "orange" },
      });

      // Creating a large basketball hoop with backboard
      const hoopPole = Bodies.rectangle(
        windowSize.width - 100,
        windowSize.height - 300,
        20,
        400,
        { isStatic: true }
      );
      const backboard = Bodies.rectangle(
        windowSize.width - 200,
        windowSize.height - 500,
        200,
        20,
        { isStatic: true }
      );
      const hoop = Bodies.circle(
        windowSize.width - 250,
        windowSize.height - 500,
        50,
        {
          isStatic: true,
          render: {
            strokeStyle: "white",
            fillStyle: "transparent",
            lineWidth: 5,
          },
        }
      );

      const mouse = Matter.Mouse.create(render.canvas);
      const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: true },
        },
      });

      let previousMousePosition = { x: 0, y: 0 };

      Matter.Events.on(mouseConstraint, "mousemove", function (event) {
        // Check if the mouse is holding the ball
        if (mouseConstraint.body === ball) {
          const mouse = event.source.mouse.position as Matter.Vector;

          // Calculate the vector between the mouse and the ball
          const dx = mouse.x - ball.position.x;
          const dy = mouse.y - ball.position.y;
          const forceMagnitude = 0.005;

          // Apply force to the ball
          Matter.Body.applyForce(ball, ball.position, {
            x: dx * forceMagnitude,
            y: dy * forceMagnitude,
          });

          // Apply torque for spinning (difference between previous and current mouse y-position)
          Matter.Body.setAngularVelocity(
            ball,
            (mouse.y - previousMousePosition.y) * 0.002
          );
        }

        previousMousePosition = event.source.mouse.position as Matter.Vector;
      });

      World.add(engine.world, [
        ground,
        leftWall,
        rightWall,
        ceiling,
        ball,
        hoopPole,
        backboard,
        hoop,
        mouseConstraint,
      ]);

      render.mouse = mouse;

      Render.run(render);
      const runner = Runner.create();
      Runner.run(runner, engine);

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
