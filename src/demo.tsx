import Matter from "matter-js";
import { useRef, useEffect, useState } from "react";

export function Demo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [engine, setEngine] = useState<Matter.Engine | null>(null);
  const [score, setScore] = useState(0); // Score counter


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

      setEngine(engine);

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

      // Creating a bouncy ball
      const ball = Bodies.circle(100, 100, 35, {
        restitution: 0.8,
        friction: 0.005,
        density: 0.04,
        label: 'ball', // Add this label to the ball
        render: {
          fillStyle: "orange",
          sprite: {
            texture: "/120px-Basketball.png", // Add path to your image
            xScale: 1, // Adjust these values
            yScale: 1  // Adjust these values
          }
        },
      });

      // Creating a large basketball hoop with backboard
      const hoopPole = Bodies.rectangle(
        windowSize.width - 200,
        windowSize.height - 225,
        40,
        1800,
        { isStatic: true
         }
        
      );
      const hoop = Bodies.rectangle(
        windowSize.width - 365,
        windowSize.height - 800,
        275,
        35,
        {
          isStatic: true,
          isSensor: true, // Allow the ball to pass through
          label: 'hoop',
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
         
          label: 'hoop',
          render: {
            strokeStyle: "transparent",
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
        const maxSpeed = 50;
        const velocity = ball.velocity;
        const newVelocity = {
          x: Math.sign(velocity.x) * Math.min(Math.abs(velocity.x), maxSpeed),
          y: Math.sign(velocity.y) * Math.min(Math.abs(velocity.y), maxSpeed)
        };
        Matter.Body.setVelocity(ball, newVelocity);
      });



      World.add(engine.world, [
        ground,
        leftWall,
        rightWall,
        ceiling,
        ball,
        hoopPole,
        hoop,
        hoopConstrant,
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

  
  const addBall = () => {
    if (engine) {
      const newBall = Matter.Bodies.circle(100, 100, 35, {
        restitution: 0.8,
        friction: 0.005,
        density: 0.04,
        label: 'ball', // Add this label to the ball
        render: {
          fillStyle: "orange",
          sprite: {
            texture: "/120px-Basketball.png", // Add path to your image
            xScale: 1, // Adjust these values
            yScale: 1  // Adjust these values
          }
        },
      });
      Matter.World.add(engine.world, [newBall]);
    }
  };

  const ballPassedThroughHoop = (event: Matter.IEventCollision<Matter.Engine>) => {
    event.pairs.forEach((pair) => {
      if ((pair.bodyA.label === 'hoop' && pair.bodyB.label.startsWith('ball')) ||
          (pair.bodyB.label === 'hoop' && pair.bodyA.label.startsWith('ball'))) {
        setScore(score + 1);
      }
    });
  };

  useEffect(() => {
    if (engine) {
      Matter.Events.on(engine, 'collisionStart', ballPassedThroughHoop);
    }
    return () => {
      if (engine) {
        Matter.Events.off(engine, 'collisionStart', ballPassedThroughHoop);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, score]);


  return (
    <div>
      <div style={{ position: 'absolute', zIndex: 2, top: 10, left: 50 }}>
      <button onClick={addBall}>Add Ball</button>
      <div>Score: {score}</div> {/* Display the score */}
    </div>
      <div
        ref={containerRef}
        id="matter-container"
        style={{
          position: 'absolute',
          zIndex: 1,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    
    </div>
  );
}
