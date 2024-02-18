import H5DetailsTemplate from "../h5-details-template-1/tournament-play-new.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  H5DetailsTemplate,
};
const component_config = {
  registered_component_key: "Detail",
  default_component_key: "H5DetailsTemplate",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

