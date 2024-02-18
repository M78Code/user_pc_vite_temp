import SimpleHeader_PC from "../simple-header-pc/index.vue";
import SimpleHeader_H5 from "../simple-header-h5/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  SimpleHeader_PC,
  SimpleHeader_H5,
};
const component_config = {
  registered_component_key: "SimpleHeader",
  default_component_key: "SimpleHeader_PC",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;