import rule_1 from "../rule-1/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  rule_1,
};
const component_config = {
  registered_component_key: "Rule",
  default_component_key: "rule_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
