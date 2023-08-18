/**
 * 用户主题设置
 *
 */
import { ls, ss } from "src/core/utils/web-storage.js";
const initialState = {
  /** 语言 */
  theme: ls.get("theme", "day"),
};
import { MITT_TYPES, useMittEmit } from "src/core/mitt/";

export default function langReducer(state = initialState, action) {
  const { type, data } = action;
  useMittEmit(MITT_TYPES.EMIT_THEME_CHANGE, data);
  switch (type) {
    /** 设置主题 */
    case "SET_THEME":
      // 设置永久持久化主题信息
      ss.set("theme", data);
      ls.set("theme", data);
      return { ...state, theme: data };
    /** 初始化主题 */
    case "INIT_THEME":
      const key = ss.get("theme", state.lang);
      if (!key) ss.set("theme", data);
      return { ...state, theme: key };

    default:
      return state;
  }
}
