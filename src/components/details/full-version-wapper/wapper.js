import H5DetailsTemplate1 from "../h5-details-template/index.vue";
import { compute_component_wapper_config } from "app/job/output/merchant/index.js";
const all_components_obj = {
  H5DetailsTemplate1,
};
const component_config = {
  registered_component_key: "Detail",
  default_component_key: "H5DetailsTemplate1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

