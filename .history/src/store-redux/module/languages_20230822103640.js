/**
 * 用户语言设置
 *  zs-简体中文
 *  zh-繁体中文（目前与zs没做区分）
 *  en-英文
 *  jp-日文
 *  ko-韩文
 *  vi-越南语
 *  th-泰国语
 */
import { nextTick } from "vue";
import { ls, ss } from "src/core/utils/web-storage.js";
import { useMittEmit, MITT_TYPES } from 'src/core/mitt/index.js'

const initialState = {
  /** 语言 */
  lang: ls.get("lang", "zh"),
  /** 语言种类 */
  lang_obj: {
    zh: [{ zh: "中文" }, { en: "EN" }],
    en: [{ zh: "Chinese" }, { en: "EN" }],
  },
  /** 标识语言是否被改变 */
  lang_change: false, // 原h5使用字段 => is_language_changing
};

export default function langReducer(state = initialState, action) {
  const { type, data } = action;
  nextTick(() => useMittEmit(MITT_TYPES.EMIT_LANG_CHANGE, data))
  switch (type) {
    /** 设置语言 */
    case "SET_LANG":
      // 设置永久持久化语言信息
      ss.set("lang", data);
      ls.set("lang", data);
      return { ...state, lang: data };
    /** 初始化语言 */
    case "INIT_LANG":
      const key = ss.get("lang", state.lang);
      if (!key) ss.set("lang", data);
      return { ...state, lang: key };
    /** 设置语言变化 */
    case "SET_LANG_CHANGE":
      return { ...state, lang_change: data };
    default:
      return state;
  }
}
