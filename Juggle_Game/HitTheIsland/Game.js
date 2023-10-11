import React, { useState, useEffect, useRef, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Dimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
  withRepeat,
  withSequence,
  BounceIn,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const dimensions = Dimensions.get("screen");
const SCREEN_WIDTH = dimensions.width;
const SCREEN_HEIGHT = dimensions.height;

const FPS = 60;
const DELTA = 1000 / FPS;
const SPEED = 1;
const GRAVITY = 0.2;
let BOUNCE_FACTOR = 0.7;

const BALL_WIDTH = SCREEN_WIDTH / 4;
const BALL_RADIUS = BALL_WIDTH / 2;

const PLAYER_WIDTH = SCREEN_WIDTH / 8;
const PLAYER_HEIGHT = SCREEN_WIDTH / 8;
const PLAYER_RADIUS = PLAYER_WIDTH / 2;

const TOTAL_RADIUS = (BALL_RADIUS + PLAYER_RADIUS) * 1.01;

const INITIAL_DIRECTION = { x: 0, y: 1 };
const INITIAL_PLAYER_DIRECTION = { x: 0, y: 1 };

const normalizeVector = (vector) => {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
};

export default function Game() {
  const { height, width } = useWindowDimensions();
  const [score, setScore] = useState(true);
  const [gameOver, setGameOver] = useState(true);

  const targetPositionX = useSharedValue(0);
  const targetPositionY = useSharedValue(0);
  const direction = useSharedValue(normalizeVector(INITIAL_DIRECTION));

  const playerPos = useSharedValue({ x: width / 4, y: height / 4 });
  const playerDirection = useSharedValue(
    normalizeVector(INITIAL_PLAYER_DIRECTION)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        update();
      }
    }, DELTA);

    return () => clearInterval(interval);
  }, [gameOver]);

  const clampPaddlePosition = () => {
    // const projectedX = playerDirection.value.x + playerPos.value.x;
    // const projectedY = playerDirection.value.y + playerPos.value.y;
    // if (projectedX > 512) {
    //   Body.setPosition(paddle, { x: 512, y: paddle.position.y });
    // }
    // if (projectedX < 64) {
    //   Body.setPosition(paddle, { x: 64, y: paddle.position.y });
    // }
    // if (projectedY > 904) {
    //   Body.setPosition(paddle, { x: paddle.position.x, y: 904 });
    // }
    // if (projectedY < 64) {
    //   Body.setPosition(paddle, { x: paddle.position.x, y: 64 });
    // }
  };

  const update = useCallback(() => {
    const clamp = 60;
    if (direction.value.x > clamp) {
      console.log("clamp");
      direction.value = { ...direction, x: clamp };
    }
    if (direction.value.y > clamp) {
      direction.value = { ...direction, y: clamp };
    }
    clampPaddlePosition();

    direction.value = { x: direction.value.x, y: direction.value.y + GRAVITY };
    let velocity = direction.value;
    let nextPos = getNextPos(velocity);
    let newDirection = velocity;

    // Bottom Wall
    if (nextPos.y > height) {
      newDirection = {
        x: velocity.x,
        y: -velocity.y * BOUNCE_FACTOR,
      };
      // setGameOver(true);
    }
    // Top Wall detection
    if (nextPos.y < -height / 2) {
      newDirection = {
        x: velocity.x,
        y: -velocity.y,
      };
    }
    // Side Walls
    if (nextPos.x < 0 || nextPos.x > SCREEN_WIDTH) {
      newDirection = { x: -velocity.x, y: velocity.y };
    }

    // Collision Hit
    let dx = playerPos.value.x - targetPositionX.value;
    let dy = playerPos.value.y - targetPositionY.value;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < TOTAL_RADIUS) {
      // angles
      let angle = Math.atan2(dy, dx);
      let sin = Math.sin(angle);
      let cos = Math.cos(angle);

      // circle1 perpendicular velocities

      let vx1 =
        playerDirection.value.x / FPS + velocity.x * cos + velocity.y * sin;
      let vy1 =
        playerDirection.value.y / FPS + velocity.y * cos - velocity.x * sin;

      newDirection = {
        x: vx1,
        y: vy1 * BOUNCE_FACTOR,
      };

      setScore(score + 1);
    }

    direction.value = { x: newDirection.x, y: newDirection.y + GRAVITY };
    nextPos = getNextPos(direction.value);

    targetPositionX.value = withTiming(nextPos.x, {
      duration: DELTA,
      easing: Easing.linear,
    });
    targetPositionY.value = withTiming(nextPos.y, {
      duration: DELTA,
      easing: Easing.linear,
    });
  }, []);

  const getNextPos = useCallback((direction) => {
    return {
      x: targetPositionX.value + direction.x * SPEED,
      y: targetPositionY.value + direction.y * SPEED,
    };
  });

  const restartGame = useCallback(() => {
    targetPositionX.value = width / 2;
    targetPositionY.value = height / 3;
    direction.value = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
  });

  const ballAnimatedStyles = useAnimatedStyle(() => {
    return {
      top: targetPositionY.value,
      left: targetPositionX.value,
    };
  });

  const playerAnimatedStyles = useAnimatedStyle(() => ({
    left: playerPos.value.x,
    top: playerPos.value.y,
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      playerDirection.value = {
        ...playerDirection.value,
        x: event.velocityX,
        y: event.velocityY,
      };
      playerPos.value = {
        ...playerPos.value,
        x: event.absoluteX,
        y: event.absoluteY,
      };
    },
  });

  const fingerOff = () => {
    playerDirection.value = INITIAL_PLAYER_DIRECTION;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score} onPress={restartGame}>
        {score}
      </Text>
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Game over</Text>
          <Button title="Restart" onPress={restartGame} />
        </View>
      )}

      {!gameOver && <Animated.View style={[styles.ball, ballAnimatedStyles]} />}

      {/* Player */}

      <PanGestureHandler onGestureEvent={gestureHandler} onEnded={fingerOff}>
        <Animated.View
          style={[styles.player, playerAnimatedStyles]}
          onTouchMove={gestureHandler}
        />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ball: {
    borderWidth: 8,
    borderColor: "black",
    backgroundColor: "white",
    width: BALL_WIDTH,
    aspectRatio: 1,
    borderRadius: 999,
    position: "absolute",
    transform: [{ translateX: -BALL_RADIUS }, { translateY: -BALL_RADIUS }],
  },
  player: {
    borderWidth: 5,
    borderColor: "black",
    position: "absolute",
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    borderRadius: 999,
    backgroundColor: "cyan",
    transform: [{ translateX: -PLAYER_RADIUS }, { translateY: -PLAYER_RADIUS }],
  },
  score: {
    fontSize: 150,
    fontWeight: "500",
    position: "absolute",
    top: 150,
    color: "lightgray",
  },
  gameOverContainer: {
    position: "absolute",
    top: 350,
  },
  gameOver: {
    fontSize: 50,
    fontWeight: "500",
    color: "red",
  },
});
