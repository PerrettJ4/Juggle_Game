import React, { useRef } from "react";
import { WebView } from "react-native-webview";
import Matter from "matter-js";
import { GameEngine } from "react-native-game-engine";

export default function AirHockey() {
  const {
    Engine,
    Render,
    World,
    Bodies,
    Body,
    Mouse,
    MouseConstraint,
    Events,
    Bounds,
  } = Matter;

  let canMove = true;
  const force = 0.01;
  const paddleClamp = 0.05;
  const engine = Engine.create({ velocityIterations: 16 });
  const world = engine.world;
  world.gravity = { x: 0, y: 0 };

  const container = useRef(null);

  const paddleBounds = Bounds.create([
    { x: 40, y: 300 },
    { x: 4, y: 964 },
    { x: 604, y: 4 },
    { x: 604, y: 964 },
  ]);

  const paddle1 = Bodies.circle(304, 100, 30, {
    slop: 0,
    frictionAir: 1,
    inverseInertia: 0,
  });

  const paddle2 = Bodies.circle(304, 868, 30, {
    slop: 0,
    frictionAir: 1,
    inverseInertia: 0,
  });

  const puck = Bodies.circle(304, 484, 20, {
    label: "puck",
    restitution: 0.5,
    friction: 0,
    frictionAir: 0.005,
    slop: 0,
  });

  const goal1 = Bodies.rectangle(304, 0, 180, 64, {
    label: "goal-1",
    isStatic: true,
    render: {
      fillStyle: "#673AB7",
    },
  });

  const goal2 = Bodies.rectangle(304, 968, 180, 64, {
    label: "goal-2",
    isStatic: true,
    render: {
      fillStyle: "#673AB7",
    },
  });

  const tableBackLeft = Bodies.rectangle(0, 0, 234, 128, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.2,
    slop: 0,
    render: {
      fillStyle: "#673AB7",
    },
  });

  const tableBackRight = Bodies.rectangle(491, 0, 234, 128, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.2,
    slop: 0,
  });

  const tableFrontLeft = Bodies.rectangle(117, 968, 234, 128, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.2,
    slop: 0,
  });

  const tableFrontRight = Bodies.rectangle(491, 968, 234, 128, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.2,
    slop: 0,
  });

  const tableSideLeft = Bodies.rectangle(0, 484, 128, 968, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.2,
    slop: 0,
  });

  const tableSideRight = Bodies.rectangle(608, 484, 128, 968, {
    isStatic: true,
    restitution: 0.9,
    friction: 0.2,
    slop: 0,
  });

  function handleCollision(event) {
    const pairs = event.pairs;
    pairs.forEach(function (pair) {
      const containsPuck = pair.bodyA.label === "puck";
      const containsGoal =
        pair.bodyB.label === "goal-1" || pair.bodyB.label === "goal-2";
      if (containsPuck && containsGoal) {
        handleTableReset();
      }
    });
  }

  function handleTableReset() {
    Body.setPosition(puck, { x: 304, y: 484 });
    Body.setVelocity(puck, { x: 0, y: 0 });
    Body.setAngularVelocity(puck, 0);
    Body.setPosition(paddle1, { x: 304, y: 100 });
    Body.setVelocity(paddle1, { x: 0, y: 0 });
    Body.setAngularVelocity(paddle1, 0);
    Body.setPosition(paddle2, { x: 304, y: 868 });
    Body.setVelocity(paddle2, { x: 0, y: 0 });
    Body.setAngularVelocity(paddle2, 0);
  }

  function handleBeforeUpdate() {
    const clamp = 60;
    const clampedVelocity = puck.velocity;
    if (puck.velocity.X > clamp) {
      clampedVelocity.x = clamp;
    }
    if (puck.velocity.y > clamp) {
      clampedVelocity.y = clamp;
    }
    Body.setVelocity(puck, clampedVelocity);
    clampPaddlePosition(paddle1);
    clampPaddlePosition(paddle2);
  }

  function updatePosition(e) {
    if (canMove) {
      const vector = { x: e.movementX * force, y: e.movementY * force };
      Body.applyForce(paddle2, paddle2.position, vector);
    }
  }

  function clampPaddlePosition(paddle) {
    const projectedX = paddle.position.x + paddle.velocity.x;
    const projectedY = paddle.position.y + paddle.velocity.y;
    if (projectedX > 512) {
      Body.setPosition(paddle, { x: 512, y: paddle.position.y });
    }
    if (projectedX < 64) {
      Body.setPosition(paddle, { x: 64, y: paddle.position.y });
    }
    if (projectedY > 904) {
      Body.setPosition(paddle, { x: paddle.position.x, y: 904 });
    }
    if (projectedY < 64) {
      Body.setPosition(paddle, { x: paddle.position.x, y: 64 });
    }
  }

  Matter.Runner.run(engine);

  Events.on(engine, "beforeUpdate", () => handleBeforeUpdate());
  Events.on(engine, "collisionStart", (event) => handleCollision(event));
  // window.addEventListener("mousemove", (e) => updatePosition(e));

  // document.addEventListener("pointerlockchange", () => unlock());

  return (
    <GameEngine
      ref={container}
      // style={{ flex: 1 }}
      systems={[handleBeforeUpdate]}
      entities={[
        puck,
        paddle2,
        goal2,
        tableBackLeft,
        tableBackRight,
        tableFrontLeft,
        tableFrontRight,
        tableSideLeft,
        tableSideRight,
        paddleBounds,
      ]}
    ></GameEngine>
  );
}
