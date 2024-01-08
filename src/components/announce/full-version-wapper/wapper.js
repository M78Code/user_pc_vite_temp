import Announce_1 from "../announce-1/index.vue";
import Announce_h5 from "../announce-h5/index.vue";
import Announce_new_pc from "../announce-new-pc/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";

const all_components_obj = {
  Announce_1,
  Announce_h5,
  Announce_new_pc
};
const component_config = {
  registered_component_key: "Announce",
  default_component_key: "Announce_1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;
