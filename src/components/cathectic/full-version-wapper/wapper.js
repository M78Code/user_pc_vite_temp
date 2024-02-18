import H5CathecticTemplate1 from "../h5-cathectic-template-1/index.vue";
// import TestComponent_2 from "../test-component-2/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  H5CathecticTemplate1,
  // TestComponent_2,
};
const component_config = {
  registered_component_key: "Cathectic",
  default_component_key: "H5CathecticTemplate1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;
