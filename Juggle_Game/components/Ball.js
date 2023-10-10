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

const Ball = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const tick = React.useCallback(() => {
    dispatch("TICK");
  }, []);

  const handleClick = React.useCallback(() => {
    dispatch("CLICK");
  }, []);

  React.useEffect(() => {
    const id = setInterval(tick, 1000 / 60);

    return () => clearInterval(id);
  }, [tick]);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: true,
      }),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          transform: [{ translateX: pan.x }, { translateY: state.position }],
        }}
        {...panResponder.panHandlers}
      >
        <View style={styles.box} />
      </Animated.View>
    </View>
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
