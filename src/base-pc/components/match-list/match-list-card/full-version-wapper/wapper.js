import MatchListCard from "../match-list-card-template-1/index.vue";
import MatchListCard_2 from "../match-list-card-template-2/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
const all_components_obj = {
  MatchListCard,
  MatchListCard_2,
};
const component_config = {
  registered_component_key: "MatchListCard",
  default_component_key: "MatchListCard",
  all_components_obj,
};
const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;
