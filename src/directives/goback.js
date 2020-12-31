import router from '@/router';
import store from '@/store';
import bus from "@/plugins/bus";
import utils from "@/utils/utils";

export default {
    install(Vue) {
        Vue.directive('goback', {
            // 当被绑定的元素插入到 DOM 中时……
            inserted: (el, binding) => {
                el.addEventListener('click', () => {
                    //移除当前页面的事件监听
                    let arr=store.getters.keepArray;
                    bus.$off(arr[arr.length - 1]);
                    //判断是否需要执行回调
                    let callbackData = utils.isNotEmpty(binding.value)?binding.value:'';
                    let callbackKey = binding.arg;
                    if (utils.isNotEmpty(callbackKey)) {
                        bus.$emit(callbackKey,callbackData);
                    }
                    //返回上一页面
                    window.history.length > 1 ? router.back() : router.push('/');
                });
            }
        });
    }
}
