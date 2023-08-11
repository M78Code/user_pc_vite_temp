import MatchTpl17AfterFullVersionWapper from "../match-tpl-17-after-template-1/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  MatchTpl17AfterFullVersionWapper,
};
const component_config = {
  registered_component_key: "MatchTpl17AfterFullVersionWapper",
  default_component_key: "MatchTpl17AfterFullVersionWapper_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;
