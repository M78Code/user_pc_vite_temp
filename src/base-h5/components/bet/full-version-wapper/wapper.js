import BetBoxH5_1 from "../bet-box-h5-1/bet_mix_box.vue";
import BetBoxAppH5_1 from "../bet-box-app-h5-1/index_1.vue"; // 复刻app-h5
import BetOuzhouH5 from "../bet-ouzhou-h5/bet_mix_box.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  BetBoxH5_1,
  BetBoxAppH5_1,
  BetOuzhouH5

};
const component_config = {
  registered_component_key: "BetBox",
  default_component_key: "BetOuzhouH5",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
export default wapper_config;
