import TeamName from "../team-name-template-1/team-name.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  TeamName,
};
const component_config = {
  registered_component_key: "TeamName",
  default_component_key: "TeamName",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;
