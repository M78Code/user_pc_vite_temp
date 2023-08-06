import bet_box_1 from "../bet-box-1/index.vue";
import bet_box_2 from "../bet-box-2/index.vue";
import bet_box_3 from "../bet-box-3/bet-single-info.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  bet_box_1,
  bet_box_2,
  bet_box_3,
};
const component_config = {
  registered_component_key: "BetBox",
  default_component_key: "bet_box_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
export default wapper_config;
