const modules = import.meta.globEager("./module/*.js");

const all_fn = {};
Object.keys(modules).forEach((key) => {
  const _key = key.replace("./module/", "").replace(".js", "");
  all_fn[_key] = modules[key];
  console.log(modules[key], _key);
});

// import
export const compute_css = ({ key = "item", theme = "day", label }) => {
  // img-bg-menu-live
  let { compute_css = () => {} } = all_fn[label] || {};
  return compute_css({ key, theme });
};
