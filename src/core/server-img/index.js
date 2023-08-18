import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";
import { MITT_TYPES, useMittOn } from "../mitt/";
import { ls, ss } from "src/core/utils/web-storage.js";

import { ref, computed } from "vue";
const theme = ref(ls.get("theme", "day"));
useMittOn(MITT_TYPES.EMIT_THEME_CHANGE, (_v) => {
  theme.value = _v;
});
// import
const compute_css = ({ key, label }) => {
  return computed(() => {
    // img-bg-menu-live
    const func = key ? sprite_compute[label] : other_compute[label];
    return func({ key, label, theme: theme.value });
  }).value;
};

export { compute_css };
