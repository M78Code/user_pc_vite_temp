import FilterRadio from "../filter-radio-template-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  FilterRadio,
};
const component_config = {
  registered_component_key: "FilterRadio",
  default_component_key: "FilterRadio",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
// console.error(wapper_config);
export default wapper_config;
