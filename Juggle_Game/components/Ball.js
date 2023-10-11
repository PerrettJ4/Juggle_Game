import React, { useRef } from "react";
import { Animated, View, StyleSheet, PanResponder, Text } from "react-native";
import { reducer } from "../reducer";

const initialState = {
  ballState: "jumping",
  delta: 0,
  position: 0,
};

function update(circle) {
  circle.x += -circle.x * 0.001;
  circle.y += -circle.y * 0.001;
}

const Ball = ({ state }) => {
  return (
    <View
      style={[
        styles.box,
        {
          transform: [
            { translateX: state.position.x },
            { translateY: state.position.y },
          ],
        },
      ]}
    ></View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold",
  },
  box: {
    height: 75,
    width: 75,
    borderRadius: 100,
    backgroundColor: "black",
  },
});

export default Ball;
