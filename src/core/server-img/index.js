export * from "./sprite-img/index";





// import
export const compute_css = ({ key , theme , label }) => {
    // img-bg-menu-live
    let { compute_css = () => {} } = all_fn[label] || {};
    return compute_css({ key, theme });
  };
  