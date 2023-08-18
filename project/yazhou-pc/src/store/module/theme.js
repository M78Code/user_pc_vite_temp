import lodash from "lodash";

const initialState = {
    /** 主题 */
    theme: ""
};

export default function themeReducer(state = initialState, action) {
    const { type, data } = action;
    switch (type) {
        // 设置主题
        case "SET_THEME":
            return { ...state, search_type: data };
        default:
            return state;
    }
}
