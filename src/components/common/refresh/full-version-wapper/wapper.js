import Refresh_1 from "../refresh/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  Refresh_1,
};
const component_config = {
  registered_component_key: "Refresh",
  default_component_key: "Refresh_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;
