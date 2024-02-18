import MatchTpl17After from "../match-tpl-17-after-template-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  MatchTpl17After,
};
const component_config = {
  registered_component_key: "MatchTpl17After",
  default_component_key: "MatchTpl17After",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;