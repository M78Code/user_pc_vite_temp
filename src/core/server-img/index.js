import sprite_compute from "./sprite-img/index";
import other_compute from "./other-img/index";

// import
const compute_css = ({ key, theme, label }) => {
  // img-bg-menu-live
  const func = key ? sprite_compute[label] : other_compute[label];
  return func({ key, label, theme });
};

export { compute_css };
