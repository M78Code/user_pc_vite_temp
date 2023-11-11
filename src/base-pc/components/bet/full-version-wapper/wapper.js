import BetBoxYaZhouPC_1 from "../bet-box-pc-1/index.vue";
import BetBoxOuZhouPC_1 from "../bet-box-ouzhou-pc-1/index_1.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  BetBoxYaZhouPC_1,
  BetBoxOuZhouPC_1,
};
const component_config = {
  registered_component_key: "BetBox",
  default_component_key: "BetBoxYaZhouPC_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
export default wapper_config;
