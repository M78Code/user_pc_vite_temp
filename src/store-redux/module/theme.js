/**
 * 用户主题设置
 *
 */
import { nextTick } from "vue";
import { LocalStorage, SessionStorage } from "src/core/utils/common/module/web-storage.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

const initialState = {
  /** 语言 */
  theme: LocalStorage.get("theme", "day"),
};

export default function themeReducer(state = initialState, action) {
  const { type, data } = action;
  data && nextTick(() => useMittEmit(MITT_TYPES.EMIT_THEME_CHANGE, data))
  switch (type) {
    /** 设置主题 */
    case "SET_THEME":
      // 设置永久持久化主题信息
      SessionStorage.set("theme", data);
      // LocalStorage.set("theme", data);
      return { ...state, theme: data };
    /** 初始化主题 */
    case "INIT_THEME":
      const key = SessionStorage.get("theme", state.lang);
      if (!key) SessionStorage.set("theme", data);
      return { ...state, theme: key };

    default:
      return state;
  }
}
