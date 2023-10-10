const JUMP_IMPULSE = 10;
const GRAVITY = -0.1;

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
      const nextPosition = state.position + nextDelta;

      if (nextPosition <= 0) {
        return initialState;
      }

      return {
        ballState: "jumping",
        delta: nextDelta,
        position: nextPosition,
      };
    }

    default:
      return state;
  }
};
