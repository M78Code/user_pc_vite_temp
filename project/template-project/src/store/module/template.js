const initialState = {
  aa: 123,
};

export default function templateReducer(state = initialState, action) {
  let new_state = {};
  switch (action.type) {
    case "www":
      new_state = { ...state, bb: 33 };
    default:
      new_state = { ...state };
  }

  return new_state;
}
