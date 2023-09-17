import Icon_1 from "../icon-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";

const all_components_obj = {
  Icon_1,
};
const component_config = {
  registered_component_key: "Icon_1",
  default_component_key: "Icon_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
