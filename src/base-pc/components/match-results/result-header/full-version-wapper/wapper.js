import ResultHeaderNewpc from "../result-header-1/new-pc-index.vue";
import ResultHeader from "../result-header-1/index.vue";
import { compute_component_wapper_config } from "app/job/use-output/index.js";
import BUILDIN_CONFIG from "app/job/output/env/index.js";
const { PROJECT_NAME } = BUILDIN_CONFIG ;
let all_components_obj = {
  ResultHeader,
};
//如果是新亚洲重构版本走这里
if(PROJECT_NAME == 'new-pc'){
  all_components_obj = {
    ResultHeader:ResultHeaderNewpc
  };
}
const component_config = {
  registered_component_key: "ResultHeader",
  default_component_key: "ResultHeader",
  all_components_obj,
};

const wapper_config = compute_component_wapper_config(component_config);
// const TestComponent = all_components_obj[wapper_config.use_component_key];
// export { TestComponent };
export default wapper_config;
