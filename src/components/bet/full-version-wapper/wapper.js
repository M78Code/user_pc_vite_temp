import bet_box_pc_1 from "../bet-box-pc-1/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  bet_box_pc_1,
};
const component_config = {
  registered_component_key: "BetBox",
  default_component_key: "bet_box_pc_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
export default wapper_config;
