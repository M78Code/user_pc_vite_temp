export { compute_css as sprite_compute } from "./sprite-img/index";
export { compute_css as other_compute } from "./other-img/index";

// import
const compute_css = ({ key, theme, label }) => {
  // img-bg-menu-live
  return key
    ? other_compute({
        theme,
        label,
      })
    : sprite_compute({ key, theme });
};

export { compute_css };
