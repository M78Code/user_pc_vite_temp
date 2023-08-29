/**
 * 用户主题设置
 *
 */
import { nextTick } from "vue";
import { ls, ss } from "src/core/utils/index.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

const initialState = {
  /** 语言 */
  theme: ls.get("theme", "day"),
};

export default function themeReducer(state = initialState, action) {
  const { type, data } = action;
  nextTick(() => useMittEmit(MITT_TYPES.EMIT_THEME_CHANGE, data))
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
