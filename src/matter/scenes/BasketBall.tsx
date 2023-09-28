import {
  Engine,
  Render,
  Runner,
  Bodies,
  World,
  Mouse,
  Events,
  Body,
  MouseConstraint,
  Constraint,
} from "matter-js";
import { useRef, useEffect, useState } from "react";

export function BasketBall() {
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
      const engine = Engine.create();

      setEngine(engine);

      const render = Render.create({
        element: containerRef.current,
        engine: engine,
        options: {
          showAngleIndicator: true,
          showCollisions: true,
          showVelocity: true,
          wireframes: false,
          width: windowSize.width,
          height: windowSize.height,
          background: "transparent",
        },
      });

      const ground = Bodies.rectangle(
        windowSize.width / 2,
        windowSize.height,
        windowSize.width,
        50,
        {
          collisionFilter: {
            category: 0x0001,
          },
          
          render: {
            sprite: {
              texture: "/court.jpg", // Add path to your image
              xScale: 1, // Adjust these values
              yScale: 0.1, // Adjust these values
             
            },
          },
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
          collisionFilter: {
            category: 0x0001,
          },
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
          collisionFilter: {
            category: 0x0001,
          },
          density: 1,
          isStatic: true,
        }
      );
      const ceiling = Bodies.rectangle(
        windowSize.width / 2,
        0,
        windowSize.width,
        50,
        {
          collisionFilter: {
            category: 0x0001,
          },
          density: 1,
          isStatic: true,
        }
      );

      // Creating a bouncy ball
      const ball = Bodies.circle(110, 110, 53, {
        collisionFilter: {
          category: 0x0001,
        },
        restitution: 0.8,
        friction: 0.05,
        density: 0.04,
        label: "ball", // Add this label to the ball
        render: {
          fillStyle: "orange",
          sprite: {
            texture: "/120px-Basketball.png", // Add path to your image
            xScale: 1, // Adjust these values
            yScale: 1, // Adjust these values
          },
        },
      });

      // Creating a large basketball hoop with backboard
      const hoopPole = Bodies.rectangle(
        windowSize.width ,
        windowSize.height - 225,
        40,
        1800,
        { 
          collisionFilter: {
            category: 0x0001,
          },
          isStatic: true }
      );

      const hoop = Bodies.rectangle(
        windowSize.width - 365,
        windowSize.height - 800,
        275,
        35,
        {
          isStatic: true,
          isSensor: true,
          label: "hoop",
          render: {
            strokeStyle: "red",
            fillStyle: "transparent",
            lineWidth: 5,
          },
        }
      );

      const hoopConstrantLeft = Bodies.rectangle(
        windowSize.width - 500,
        windowSize.height - 780,
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

      const secondHoopConstrantLeft = Bodies.rectangle(
        windowSize.width - 490,
        windowSize.height - 720,
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

      const hoopConstrantRight = Bodies.rectangle(
        windowSize.width - 230,
        windowSize.height - 780,
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

      const secondHoopConstraintRight = Bodies.rectangle(
        windowSize.width - 235,
        windowSize.height - 720,
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

      const thirdHoopConstraintRight = Bodies.rectangle(
        windowSize.width - 275,
        windowSize.height - 640,
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

      const thirdHoopConstrantLeft = Bodies.rectangle(
        windowSize.width - 450,
        windowSize.height - 640,
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

      const yOffset = 30;
      const numSegments = 10;
      const segmentHeight = 10;
      const segmentWidth = 10;

      const netBodies = [];
      const netConstraints = [];
      let alternate = 1;
      for (let i = 0; i < numSegments; i++) {
        const yPos = windowSize.height - 800 + yOffset + i * segmentHeight;
        const xPos = windowSize.width - 365 + alternate * segmentWidth;

        const netBody = Bodies.circle(xPos, yPos, 5, {
          isStatic: false,
          render: { fillStyle: "grey" },
        });
        netBodies.push(netBody);

        if (i > 0) {
          const constraint = Constraint.create({
            bodyA: netBodies[i],
            bodyB: netBodies[i - 1],
            length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
            stiffness: 0.5,
            render: { strokeStyle: "white", lineWidth: 1 },
          });

          netConstraints.push(constraint);
        }
        alternate = -alternate;
      }


      // Attach the first net body to the hoop
      const firstNetConstraint = Constraint.create({
        bodyA: hoopConstrantLeft,
        bodyB: netBodies[0],
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const secondNetConstraint = Constraint.create({
        bodyA: netBodies[numSegments - 1],
        bodyB: secondHoopConstraintRight,
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });
      

      netConstraints.push(firstNetConstraint, secondNetConstraint);

      const netBodies2 = [];
      const netConstraints2 = [];
      let alternate2 = 1;
      for (let i = 0; i < numSegments; i++) {
        const yPos = windowSize.height - 800 + yOffset + i * segmentHeight;
        const xPos = windowSize.width - 365 + alternate * segmentWidth;

        const netBody2 = Bodies.circle(xPos, yPos, 5, {
          isStatic: false,
          render: { fillStyle: "frey" },
        });
        netBodies2.push(netBody2);

        if (i > 0) {
          const constraint2 = Constraint.create({
            bodyA: netBodies2[i],
            bodyB: netBodies2[i - 1],
            length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
            stiffness: 0.5,
            render: { strokeStyle: "white", lineWidth: 1 },
          });

          netConstraints2.push(constraint2);
        }
        alternate2 = -alternate2;
      }


      const first2NetConstraint = Constraint.create({
        bodyA: hoopConstrantRight,
        bodyB: netBodies2[0],
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const second2NetConstraint = Constraint.create({
        bodyA: netBodies2[numSegments - 1],
        bodyB: secondHoopConstrantLeft,
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });
      

      netConstraints2.push(first2NetConstraint, second2NetConstraint);

      const netBodies3 = [];
      const netConstraints3 = [];
      let alternate3 = 1;
      for (let i = 0; i < numSegments; i++) {
        const yPos = windowSize.height - 800 + yOffset + i * segmentHeight;
        const xPos = windowSize.width - 365 + alternate * segmentWidth;

        const netBody3 = Bodies.circle(xPos, yPos, 5, {
          isStatic: false,
          render: { fillStyle: "grey" },
        });
        netBodies3.push(netBody3);

        if (i > 0) {
          const constraint3 = Constraint.create({
            bodyA: netBodies3[i],
            bodyB: netBodies3[i - 1],
            length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
            stiffness: 0.5,
            render: { strokeStyle: "white", lineWidth: 1 },
          });

          netConstraints3.push(constraint3);
        }
        alternate3 = -alternate3;
      }


      // Attach the first net body to the hoop
      const thirdNetConstraint = Constraint.create({
        bodyA: secondHoopConstrantLeft,
        bodyB: netBodies3[0],
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const fourthNetConstraint = Constraint.create({
        bodyA: netBodies3[numSegments - 1],
        bodyB: thirdHoopConstraintRight,
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });
      

      netConstraints3.push(thirdNetConstraint, fourthNetConstraint);

      const netBodies4 = [];
      const netConstraints4 = [];
      let alternate4 = 1;
      for (let i = 0; i < numSegments; i++) {
        const yPos = windowSize.height - 800 + yOffset + i * segmentHeight;
        const xPos = windowSize.width - 365 + alternate * segmentWidth;

        const netBody4 = Bodies.circle(xPos, yPos, 5, {
          isStatic: false,
          render: { fillStyle: "grey" },
        });
        netBodies4.push(netBody4);

        if (i > 0) {
          const constraint4 = Constraint.create({
            bodyA: netBodies4[i],
            bodyB: netBodies4[i - 1],
            length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
            stiffness: 0.5,
            render: { strokeStyle: "white", lineWidth: 1 },
          });


          netConstraints4.push(constraint4);
        }
        alternate4 = -alternate4;
      }

      const netBodies5 = [];
      const netConstraints5 = [];
      let alternate5 = 1;
      for (let i = 0; i < numSegments; i++) {
        const yPos = windowSize.height - 800 + yOffset + i * segmentHeight;
        const xPos = windowSize.width - 365 + alternate * segmentWidth;

        const netBody5 = Bodies.circle(xPos, yPos, 5, {
          isStatic: false,
          render: { fillStyle: "grey" },
        });
        netBodies5.push(netBody5);

        if (i > 0) {
          const constraint5 = Constraint.create({
            bodyA: netBodies5[i],
            bodyB: netBodies5[i - 1],
            length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
            stiffness: 0.3,
            render: { strokeStyle: "white", lineWidth: 1 },
          });


          netConstraints5.push(constraint5);
        }
        alternate5 = -alternate5;
      }

      netConstraints5.push(thirdNetConstraint, fourthNetConstraint);

      const constraintBetween1 = Constraint.create({
        bodyA: hoopConstrantLeft,
        bodyB: secondHoopConstrantLeft,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const constraintBetween2 = Constraint.create({
        bodyA: hoopConstrantRight,
        bodyB: secondHoopConstraintRight,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const constraintBetween4 = Constraint.create({
        bodyA: secondHoopConstrantLeft,
        bodyB: thirdHoopConstrantLeft,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const constraintBetween5 = Constraint.create({
        bodyA: secondHoopConstraintRight,
        bodyB: thirdHoopConstraintRight,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      netConstraints.push(constraintBetween1, constraintBetween2, constraintBetween4, constraintBetween5);

      

      // Attach the first net body to the hoop
      const fifthNetConstraint = Constraint.create({
        bodyA: secondHoopConstraintRight,
        bodyB: netBodies4[0],
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const sixthNetConstraint = Constraint.create({
        bodyA: netBodies4[numSegments - 1],
        bodyB: thirdHoopConstrantLeft,
        length: 0,
        stiffness: 0.5,
        render: { strokeStyle: "white", lineWidth: 1 },
      });
      

      netConstraints4.push(fifthNetConstraint, sixthNetConstraint);

      const seventhNetConstraint = Constraint.create({
        bodyA: thirdHoopConstrantLeft,
        bodyB: netBodies5[0],
        length: 0,
        stiffness: 0.3,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const eigthNetConstraint = Constraint.create({
        bodyA: netBodies5[numSegments - 1],
        bodyB: thirdHoopConstraintRight,
        length: 0,
        stiffness: 0.3,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      netConstraints5.push(seventhNetConstraint, eigthNetConstraint);

      
      // Add the net bodies and constraints to the world
      World.add(engine.world, [...netBodies2, ...netConstraints2]);
      World.add(engine.world, [...netBodies3, ...netConstraints3]);
      World.add(engine.world, [...netBodies4, ...netConstraints4]);
      World.add(engine.world, [...netBodies5, ...netConstraints5]);
      World.add(engine.world, [...netBodies, ...netConstraints]);
      const mouse = Mouse.create(render.canvas);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: { visible: true },
        },
      });

      let previousMousePosition = { x: 0, y: 0 };

      Events.on(mouseConstraint, "mousemove", function (event) {
        // Check if the mouse is holding the ball
        if (mouseConstraint.body === ball) {
          const mouse = event.source.mouse.position as Matter.Vector;

          // Calculate the vector between the mouse and the ball
          const dx = mouse.x - ball.position.x;
          const dy = mouse.y - ball.position.y;
          const forceMagnitude = 0.005;

          // Apply force to the ball
          Body.applyForce(ball, ball.position, {
            x: dx * forceMagnitude,
            y: dy * forceMagnitude,
          });

          // Apply torque for spinning (difference between previous and current mouse y-position)
          Body.setAngularVelocity(
            ball,
            (mouse.y - previousMousePosition.y) * 0.002
          );
        }

        previousMousePosition = event.source.mouse.position as Matter.Vector;
        const maxSpeed = 32;
        const velocity = ball.velocity;
        const newVelocity = {
          x: Math.sign(velocity.x) * Math.min(Math.abs(velocity.x), maxSpeed),
          y: Math.sign(velocity.y) * Math.min(Math.abs(velocity.y), maxSpeed),
        };
        Body.setVelocity(ball, newVelocity);
      });

       const speed = Math.sqrt(Math.pow(ball.velocity.x, 2) + Math.pow(ball.velocity.y, 2));
  
  // Update the div
  const speedDisplay = document.getElementById('speedDisplay');

  if (speedDisplay) {
    // Only update the inner text if the element exists
    speedDisplay.innerText = `Speed: ${speed.toFixed(2)}`;
  }
  if (speedDisplay) {
    speedDisplay.innerText = `Speed: ${speed.toFixed(2)}`;
  }

      World.add(engine.world, [
        ground,
        leftWall,
        rightWall,
        ceiling,
        ball,
        hoopPole,
        hoop,
        hoopConstrantLeft,
        hoopConstrantRight,
        secondHoopConstraintRight,
        secondHoopConstrantLeft,
        thirdHoopConstraintRight,
        thirdHoopConstrantLeft,
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
      const newBall = Bodies.circle(100, 100, 35, {
        restitution: 0.8,
        friction: 0.005,
        density: 0.04,
        label: "ball", // Add this label to the ball
        render: {
          fillStyle: "orange",
          sprite: {
            texture: "/120px-Basketball.png", // Add path to your image
            xScale: 1, // Adjust these values
            yScale: 1, // Adjust these values
          },
        },
      });
      World.add(engine.world, [newBall]);
    }
  };

  const ballPassedThroughHoop = (
    event: Matter.IEventCollision<Matter.Engine>
  ) => {
    event.pairs.forEach((pair) => {
      if (
        (pair.bodyA.label === "hoop" && pair.bodyB.label.startsWith("ball")) ||
        (pair.bodyB.label === "hoop" && pair.bodyA.label.startsWith("ball"))
      ) {
        setScore(score + 1);
      }
    });
  };

  useEffect(() => {
    if (engine) {
      Events.on(engine, "collisionStart", ballPassedThroughHoop);
    }
    return () => {
      if (engine) {
        Events.off(engine, "collisionStart", ballPassedThroughHoop);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine, score]);

  return (
    <div>
      <div style={{ position: "absolute", zIndex: 2, top: 10, left: 50 }}>
        <button onClick={addBall}>Add Ball</button>
        <div>Score: {score}</div> {/* Display the score */}
        <div id="speedDisplay">Speed: 0</div>
      </div>
      <div
        ref={containerRef}
        id="matter-container"
        style={{
          position: "absolute",
          zIndex: 1,
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
