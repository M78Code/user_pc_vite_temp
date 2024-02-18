import H5FooterMenu from "../h5-footer-template-1/footer-menu.vue"
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  H5FooterMenu,
};
const component_config = {
  registered_component_key: "Menu",
  default_component_key: "H5FooterMenu",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

