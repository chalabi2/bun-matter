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

  let shotPosition: { x: number | null; y: number | null } | null = null;

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
        0,  // x-position (left edge of the canvas)
        windowSize.height / 2,  // y-position (center of the canvas height)
        50,
        windowSize.height * 8,
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
        windowSize.width,  // x-position (right edge of the canvas)
    windowSize.height / 2,  // y-position (center of the canvas height)
    50,  
        windowSize.height * 8,
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
        225,
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

      const minShoot = Bodies.rectangle(
        windowSize.width,
        windowSize.height - 600,
        windowSize.width * 2,
        2,
        {
          isStatic: true,
          isSensor: true,
          render: {
            strokeStyle: "rgba(0,0,0,0.25",
            fillStyle: "dotted",
            lineWidth: 5,
          },
        }
      );

      const hoopConstrantLeft = Bodies.rectangle(
        windowSize.width - 305 + 25,
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
        windowSize.width - 295 + 25,
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
        windowSize.width - 33 - 25,
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
        windowSize.width - 38 - 25,
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
        windowSize.width - 78 - 20,
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
        windowSize.width - 255 + 20,
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


      let isOnGround = true;
let jumpForce = 4;  // Initial jump force
const maxJumpForce = 26;  // Maximum jump force
const forceIncrement = 2.5;  // Increment amount

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.code === "Space" && isOnGround) {  // Check if the ball is on the ground
    // Apply the current jump force
    Body.applyForce(ball, ball.position, {
      x: 0,
      y: -jumpForce,
    });
    isOnGround = false;  // Set isOnGround to false as the ball is now in the air
  }
});

// Detecting when the ball hits the ground or other objects
Events.on(engine, 'collisionStart', (event) => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.bodyA === ball || pair.bodyB === ball) {
      // The ball has hit the ground or another object
      isOnGround = true;

      // Increase the jump force for the next jump, up to the maximum
      if (jumpForce < maxJumpForce) {
        jumpForce += forceIncrement;
      } else {
        // Reset the jump force once the maximum is reached
        jumpForce = 1;
      }
    }
  }
});

Events.on(engine, 'collisionEnd', (event) => {
  const pairs = event.pairs;
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    if (pair.bodyA === ball || pair.bodyB === ball) {
      // This line is optional, as isOnGround is already set to false in the keydown event
      // isOnGround = false;  
    }
  }
});

Events.on(render, 'afterRender', () => {
  if (isOnGround) {
    const context = render.context;
    const radius = ball.circleRadius ? ball.circleRadius + 10 : 10;  // Add a null check to ball.circleRadius
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, radius, 0, Math.PI * 2);
    context.strokeStyle = '#AAFF00';
    context.lineWidth = 5;  // Adjust to change the thickness of the loop
    context.stroke();
  }
});

Events.on(render, 'afterRender', () => {
  if (!isOnGround) {
    const context = render.context;
    const radius = ball.circleRadius ? ball.circleRadius + 10 : 10;  // Add a null check to ball.circleRadius
    context.beginPath();
    context.arc(ball.position.x, ball.position.y, radius, 0, Math.PI * 2);
    context.strokeStyle = 'red';
    context.lineWidth = 5;  // Adjust to change the thickness of the loop
    context.stroke();
  }
});

      const maxSpeed = 10;  // Set your desired maximum speed

      document.addEventListener("mousemove", (e) => {
          const mouseX = e.clientX;
          const ballX = ball.position.x;
          const forceMagnitudeX = (mouseX - ballX) * 0.001;  // Adjust the multiplier to control the sensitivity
          const canvasCenter = render.canvas.width / 2;
        
          // Stop mouse control if mouseX is greater than halfway across the page
          if (mouseX > canvasCenter) return;
          
          Body.applyForce(ball, ball.position, {
              x: forceMagnitudeX,
              y: 0,
          });
      
          // Get the current velocity of the ball
          const velocity = ball.velocity;
      
          // If the velocity exceeds the max speed, clamp it
          if (Math.abs(velocity.x) > maxSpeed) {
              const newVelocityX = velocity.x > 0 ? maxSpeed : -maxSpeed;
              Body.setVelocity(ball, { x: newVelocityX, y: velocity.y });
          }
      });
     

      let hasShot = false;  // Flag to check if the ball has been shot

      const calculateShot = (ballYPosition: number, ballXPosition: number) => {
        const hoopHeight = windowSize.height - 600;  // Setting the hoop's height
        const hoopX = windowSize.width - 170;  // Setting the hoop's x-position
        const minY = hoopHeight;  // Minimum height for shooting is the height of the hoop
        const maxY = render.canvas.height;  // Maximum height (assumed to be ground level)
        const preferredY = hoopHeight - (hoopHeight / 2);  // Preferred height for the best shot is above the hoop
        
        // Calculate the horizontal distance to the hoop
        const distanceToHoop = Math.abs(hoopX - ballXPosition);
        
        // Normalize the ball's y-position to a value between 0 and 1
        const normalizedY = (maxY - ballYPosition) / (maxY - minY);
        const preferredYFactor = Math.abs(ballYPosition - preferredY) / (maxY - minY);
        
        // Interpolate the force and angle based on the normalized y-position, the preferredYFactor, and the distance to the hoop
        const minForce = 10;  // Minimum force
        const maxForce = 20 + distanceToHoop * 0.02;  // Increase maxForce based on distance to hoop
        const force = minForce + (maxForce - minForce) * (1 - preferredYFactor);  // More force for closer to preferredY
        
        const minAngle = Math.PI / 8;  // Minimum angle
        const maxAngle = Math.PI / 4;  // Maximum angle
        const angle = minAngle + (maxAngle - minAngle) * normalizedY;  // Angle based on height
        console.log('force:', force, 'angle:', angle, 'forceX:');
        return { force, angle };
    };
    const hoopHeight = windowSize.height - 600;  // Setting the hoop's height
        // Setting the hoop's x-position
        const minY = hoopHeight;

    document.addEventListener("mousedown", (e) => {
        e.preventDefault();
        // Check if the ball's height is within the specified range and if the ball hasn't been shot yet
        if (ball.position.y <= minY && !hasShot) {
          shotPosition = { ...ball.position }; 
            // Calculate the force and angle based on the ball's current height and x-position
            const { force, angle } = calculateShot(ball.position.y, ball.position.x);
      
            // Apply the calculated force and angle to the ball
            const forceX = force * Math.cos(angle);
            const forceY = -force * Math.sin(angle);
            Body.applyForce(ball, ball.position, { x: forceX, y: forceY });
            
            hasShot = true;  // Set hasShot to true as the ball has been shot
        }
    });
    
      
      // Reset hasShot to false when the ball hits the ground or other objects
      Events.on(engine, 'collisionStart', (event) => {
          const pairs = event.pairs;
          for (let i = 0; i < pairs.length; i++) {
              const pair = pairs[i];
              if (pair.bodyA === ball || pair.bodyB === ball) {
                  hasShot = false;  // Reset hasShot flag when the ball hits the ground or other objects
              }
          }
      });
      World.add(engine.world, [
        ground,
        leftWall,
        rightWall,
        ball,
        hoop,
        hoopConstrantLeft,
        hoopConstrantRight,
        secondHoopConstraintRight,
        secondHoopConstrantLeft,
        thirdHoopConstraintRight,
        minShoot,
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

  
  const hoop = Bodies.rectangle(
    windowSize.width - 170,
    windowSize.height - 600,
    225,
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

  const calculateScore = (distance: number, height: number) => {
    return distance + height;
};

  const ballPassedThroughHoop = (event: Matter.IEventCollision<Matter.Engine>) => {
    event.pairs.forEach((pair) => {
      if (
        (pair.bodyA.label === "hoop" && pair.bodyB.label.startsWith("ball")) ||
        (pair.bodyB.label === "hoop" && pair.bodyA.label.startsWith("ball"))
      ) {
        const hoopPosition = hoop.position; // Assuming hoop is accessible in this scope
        const distance = shotPosition?.x && hoopPosition ? Math.abs(hoopPosition.x - shotPosition.x) : 0;
        const height = Math.abs(hoopPosition.y - (shotPosition?.y ?? 0));
        const shotScore = calculateScore(distance, height);
        setScore(score + shotScore);
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
