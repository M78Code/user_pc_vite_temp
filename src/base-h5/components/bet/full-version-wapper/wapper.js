import BetBoxH5_1 from "../bet-box-h5-1/bet_mix_box.vue";
import BetBoxAppH5_1 from "../bet-box-app-h5-1/bet_mix_box.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  BetBoxH5_1,
  BetBoxAppH5_1,
};
const component_config = {
  registered_component_key: "BetBox",
  default_component_key: "BetBoxH5_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
export default wapper_config;
