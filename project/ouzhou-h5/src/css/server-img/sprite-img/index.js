const modules = import.meta.globEager("./module/*.js");
const all_fn = {};
Object.keys(modules).forEach((key) => {
  const _key = key.replace("./module/", "").replace(".js", "");
  all_fn[_key] = modules[key].compute_css_obj || (() => {});
});
export default all_fn;
