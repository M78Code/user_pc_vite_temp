import Select_1 from "../select/index.vue";
import Select_n from "../select-n/index.vue";
import Select_y from "../select-y/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";

const all_components_obj = {
  Select_1,
  Select_n,
  Select_y
};
const component_config = {
  registered_component_key: "Select",
  default_component_key: "Select_n",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
