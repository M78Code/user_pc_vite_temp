import TestComponent_1 from "./test-component-1/index.vue";
import TestComponent_2 from "./test-component-2/index.vue";


import  {get_use_component} from "app/job/output/merchant/index.js";

 


const TestComponent =  get_use_component({
    all_components_obj: {
        TestComponent_1,
        TestComponent_2,
      },
      default_component_key:"TestComponent_1"  ,
      registered_component_key:"TestComponent"
});



export { TestComponent };
