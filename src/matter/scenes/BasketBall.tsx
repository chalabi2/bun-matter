import {
  Engine,
  Render,
  Runner,
  Bodies,
  World,
  Events,
  Body,
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
          wireframes: false,
          width: windowSize.width,
          height: windowSize.height,
          background: "/audience.png",
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
        windowSize.height + 800,
        {
          collisionFilter: {
            category: 0x0001,
          },
          render: {
            fillStyle: "transparent",
          },
          density: 1,
          isStatic: true,
        }
      );
      const rightWall = Bodies.rectangle(
        windowSize.width,
        windowSize.height / 4,
        50,
        windowSize.height + 1200,
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
        -800,
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

      const hoop = Bodies.rectangle(
        windowSize.width - 170,
        windowSize.height - 600,
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
        windowSize.width - 305,
        windowSize.height - 580,
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
        windowSize.width - 295,
        windowSize.height - 520,
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
        windowSize.width - 33,
        windowSize.height - 580,
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
        windowSize.width - 38,
        windowSize.height - 520,
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
        windowSize.width - 78,
        windowSize.height - 440,
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
        windowSize.width - 255,
        windowSize.height - 440,
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
            stiffness: 0.1,
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
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const secondNetConstraint = Constraint.create({
        bodyA: netBodies[numSegments - 1],
        bodyB: secondHoopConstraintRight,
        length: 0,
        stiffness: 0.1,
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
            stiffness: 0.1,
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
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const second2NetConstraint = Constraint.create({
        bodyA: netBodies2[numSegments - 1],
        bodyB: secondHoopConstrantLeft,
        length: 0,
        stiffness: 0.1,
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
            stiffness: 0.1,
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
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const fourthNetConstraint = Constraint.create({
        bodyA: netBodies3[numSegments - 1],
        bodyB: thirdHoopConstraintRight,
        length: 0,
        stiffness: 0.1,
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
            stiffness: 0.1,
            render: { strokeStyle: "white", lineWidth: 1 },
          });

          netConstraints4.push(constraint4);
        }
        alternate4 = -alternate4;
      }

      const netBodies5 = [];
      const netBodies6 = [];
      const netConstraints5 = [];
      const netConstraints6 = [];
      let alternate5 = 1;
      for (let i = 0; i < numSegments; i++) {
        const yPos = windowSize.height - 800 + yOffset + i * segmentHeight;
        const xPos = windowSize.width - 365 + alternate * segmentWidth;

        const netBody5 = Bodies.circle(xPos, yPos, 5, {
          isStatic: false,
          render: { fillStyle: "grey" },
        });
        netBodies5.push(netBody5);
        netBodies6.push(netBody5);

        if (i > 0) {
          const constraint5 = Constraint.create({
            bodyA: netBodies5[i],
            bodyB: netBodies5[i - 1],
            length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
            stiffness: 0.1,
            render: { strokeStyle: "white", lineWidth: 1 },
          });

          netConstraints5.push(constraint5);
          netConstraints6.push(constraint5);
        }
        alternate5 = -alternate5;
      }

      netConstraints5.push(thirdNetConstraint, fourthNetConstraint);

      const constraintBetween1 = Constraint.create({
        bodyA: hoopConstrantLeft,
        bodyB: secondHoopConstrantLeft,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const constraintBetween2 = Constraint.create({
        bodyA: hoopConstrantRight,
        bodyB: secondHoopConstraintRight,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const constraintBetween4 = Constraint.create({
        bodyA: secondHoopConstrantLeft,
        bodyB: thirdHoopConstrantLeft,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const constraintBetween5 = Constraint.create({
        bodyA: secondHoopConstraintRight,
        bodyB: thirdHoopConstraintRight,
        length: Math.sqrt(segmentHeight ** 2 + segmentWidth ** 2),
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      netConstraints.push(
        constraintBetween1,
        constraintBetween2,
        constraintBetween4,
        constraintBetween5
      );

      // Attach the first net body to the hoop
      const fifthNetConstraint = Constraint.create({
        bodyA: secondHoopConstraintRight,
        bodyB: netBodies4[0],
        length: 0,
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const sixthNetConstraint = Constraint.create({
        bodyA: netBodies4[numSegments - 1],
        bodyB: thirdHoopConstrantLeft,
        length: 0,
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      netConstraints4.push(fifthNetConstraint, sixthNetConstraint);

      const seventhNetConstraint = Constraint.create({
        bodyA: thirdHoopConstrantLeft,
        bodyB: netBodies5[0],
        length: 0,
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      const eigthNetConstraint = Constraint.create({
        bodyA: netBodies5[numSegments - 1],
        bodyB: thirdHoopConstraintRight,
        length: 0,
        stiffness: 0.1,
        render: { strokeStyle: "white", lineWidth: 1 },
      });

      netConstraints5.push(seventhNetConstraint, eigthNetConstraint);

      // Add the net bodies and constraints to the world
      World.add(engine.world, [...netBodies2, ...netConstraints2]);
      World.add(engine.world, [...netBodies3, ...netConstraints3]);
      World.add(engine.world, [...netBodies4, ...netConstraints4]);
      World.add(engine.world, [...netBodies5, ...netConstraints5]);
      World.add(engine.world, [...netBodies, ...netConstraints]);

      // Add these variables for the keyboard-based launching system
      let isCharging = false;
      let startChargeTime = 0; // Changed from const to let
      let meterValue = 0;

      document.addEventListener("keydown", (e) => {
        e.preventDefault();
        if (e.code === "Space") {
          const x_start = ball.position.x;
          const y_start = ball.position.y;
          const x = hoop.position.x;
          const y = hoop.position.y;

          const horizontalVelocity = x - x_start;
          const verticalVelocity =
            ((y - y_start) / -0.4) * engine.world.gravity.y;

          const perfectForceX = horizontalVelocity / ball.mass;
          const perfectForceY = verticalVelocity / ball.mass;

          console.log(
            `Perfect Force X: ${perfectForceX}, Perfect Force Y: ${perfectForceY}`
          );
          console.log(`Meter Value: ${meterValue}`);

          if (!isCharging) {
            isCharging = true;
            startChargeTime = Date.now();
          } else {
            let forceMagnitudeX = perfectForceX;
            let forceMagnitudeY = perfectForceY;
            const powerMultiplier = 40; // You may need to adjust this value based on your requirements

            if (meterValue >= 95 && meterValue <= 100) {
              // Apply multiplier
              forceMagnitudeX = perfectForceX * powerMultiplier;
              forceMagnitudeY = perfectForceY * powerMultiplier;
            } else if (meterValue >= 66 && meterValue < 95) {
              forceMagnitudeX *= 0.6 * powerMultiplier;
              forceMagnitudeY *= 0.6 * powerMultiplier;
            } else {
              forceMagnitudeX *= 0.3 * powerMultiplier;
              forceMagnitudeY *= 0.3 * powerMultiplier;
            }

            Body.applyForce(ball, ball.position, {
              x: forceMagnitudeX / 1.5,
              y: -forceMagnitudeY * 1.09,
            });

            console.log(
              `Applied Force X: ${forceMagnitudeX}, Applied Force Y: ${-forceMagnitudeY}`
            );
            isCharging = false;
          }
        }
      });

      Events.on(render, "afterRender", () => {
        if (isCharging) {
          const ctx = render.context;
          const currentTime = Date.now();
          const chargeDuration = currentTime - startChargeTime;

          // Calculate the meter value (between 0 and 100)
          meterValue = Math.sin(chargeDuration * 0.005) * 100 + 100;

          // Create a linear gradient
          const grd = ctx.createLinearGradient(
            render.canvas.width - 100,
            700,
            render.canvas.width - 90,
            700 + 200 // Extend the height to 200
          );
          grd.addColorStop(0, "green"); // Start color
          grd.addColorStop(0.5, "yellow"); // Middle color
          grd.addColorStop(1, "red"); // End color

          // Use the gradient as the fillStyle
          ctx.fillStyle = grd;

          // Draw the meter rectangle. Extend the height to 200
          ctx.fillRect(render.canvas.width - 100, 700, 10, 200);

          // Draw the moving slider
          ctx.fillStyle = "white";
          ctx.fillRect(
            render.canvas.width - 105,
            700 + (200 - meterValue),
            20,
            5
          );
        }
      });

      World.add(engine.world, [
        ground,
        leftWall,
        rightWall,
        ceiling,
        ball,
        hoop,
        hoopConstrantLeft,
        hoopConstrantRight,
        secondHoopConstraintRight,
        secondHoopConstrantLeft,
        thirdHoopConstraintRight,
        thirdHoopConstrantLeft,
      ]);

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
