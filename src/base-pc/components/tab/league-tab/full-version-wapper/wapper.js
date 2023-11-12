import LeagueTab from "../league-tab-template-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  LeagueTab,
};
const component_config = {
  registered_component_key: "LeagueTab",
  default_component_key: "LeagueTab",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
