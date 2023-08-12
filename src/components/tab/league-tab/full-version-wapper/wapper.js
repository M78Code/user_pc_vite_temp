import LeagueTab from "../common-tab-1/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  LeagueTab,
};
const component_config = {
  registered_component_key: "LeagueTab",
  default_component_key: "LeagueTab_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
