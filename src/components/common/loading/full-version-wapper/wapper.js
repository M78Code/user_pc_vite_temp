import Loading_1 from "../loading-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  Loading_1,
};
const component_config = {
  registered_component_key: "Loading",
  default_component_key: "Loading_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;