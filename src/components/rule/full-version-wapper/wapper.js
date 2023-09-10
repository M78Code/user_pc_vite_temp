import Rule_1 from "../rule-1/index.vue";
import Rule_h5 from "../rule-h5/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  Rule_1,
  Rule_h5,
};
const component_config = {
  registered_component_key: "Rule",
  default_component_key: "Rule_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config
