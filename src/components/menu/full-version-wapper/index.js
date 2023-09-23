

import { h } from 'vue'
import wapper_config from "./wapper.js";
let {
    all_components,
    is_full_version,
    use_component_key,
    components_keys,
    registered_component_key,
} = wapper_config;
// console.error(registered_component_key, components_keys, is_full_version)
const vnode = h(all_components[use_component_key], {
    props: {
        components_keys,
        registered_component_key,
        is_full_version,
    }
})
export default vnode


