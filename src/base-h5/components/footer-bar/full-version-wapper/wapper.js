import FooterOuzhou1 from "../footer-ouzhou-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  FooterOuzhou1,
};
const component_config = {
  registered_component_key: "FooterMenu",
  default_component_key: "FooterOuzhou1",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);

export default wapper_config;

