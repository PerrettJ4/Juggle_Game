import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import Foot from "./components/Foot";
import Ball from "./components/Ball";

const { SCREEN_WIDTH, SCREEN_HEIGHT } = Dimensions.get("window");

import Canvas from "react-native-canvas";

export default function App() {
  const canvasRef = useRef(null);

  const handleCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    let raf;

    const ball = {
      x: 100,
      y: 100,
      vx: 5,
      vy: 2,
      radius: 25,
      color: "blue",
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "blue";
        ctx.fill();
      },
    };

    function draw() {
      ctx.clearRect(0, 0, ctx.width, ctx.height);
      ball.draw();
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vy *= 0.99;
      ball.vy += 0.25;

      if (ball.y + ball.vy > ctx.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > ctx.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }

      raf = window.requestAnimationFrame(draw);
    }

    raf = window.requestAnimationFrame(draw);

    ball.draw();
  };

  useEffect(() => {
    canvasRef.current.height = "100%";
    canvasRef.current.width = "100%";
    handleCanvas();
  }, []);

  return <Canvas style={styles.container} ref={canvasRef} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 5,
    borderColor: "grey",
    // backgroundColor: "orange",
  },
});
