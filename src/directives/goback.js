import router from '@/router';
import bus from "@/plugins/bus";
import utils from "@/utils/utils";

export default {
    install(Vue) {
        Vue.directive('goback', {
            // 当被绑定的元素插入到 DOM 中时……
            inserted: (el, binding) => {
                el.addEventListener('click', () => {
                    let callbackData = utils.isNotEmpty(binding.value)?binding.value:'';
                    let callbackKey = binding.arg;
                    if (utils.isNotEmpty(callbackKey)) {
                        bus.$emit(callbackKey,callbackData);
                    }
                    window.history.length > 1 ? router.back() : router.push('/');
                });
            }
        });
    }
}
