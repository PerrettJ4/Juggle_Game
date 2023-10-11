const JUMP_IMPULSE = 10;
const GRAVITY = -0.01;

export const reducer = (state, event) => {
  switch (event) {
    case "CLICK": {
      if (state.ballState === "jumping") return state;

      return {
        ...state,
        ballState: "jumping",
        delta: state.delta + JUMP_IMPULSE,
      };
    }

    case "TICK": {
      if (state.ballState === "idle") return state;

      const nextDelta = state.delta - GRAVITY;
      const nextY = state.position.y + nextDelta;
      const nextX = state.position.x;

      if (nextY <= 0) {
        return initialState;
      }

      return {
        ballState: "jumping",
        delta: nextDelta,
        position: { x: nextX, y: nextY },
      };
    }

    default:
      return state;
  }
};
