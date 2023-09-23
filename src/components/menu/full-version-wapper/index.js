

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
export default {
    inheritAttrs: false,
    setup(props, { slots, emit, attrs }) {
        return () => h(all_components[use_component_key], null, slots)
    },
}


