import Vue from 'vue';
import {ImagePreview} from 'vant';

/**
 * 如果是单独的一张图片 直接v-show-image 如果是ids v-show-image={ids:ids;index:1}  如果是图片集合 v-show-image={imgs:imgs;index:0}
 * ps index 在ids 和imgs 时候传入下标  默认为0 可不传
 * @type {DirectiveOptions}
 */
const showImage = Vue.directive('show-image', {

    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el, binding) {
        showBig(el, binding);
    },
    update: function (el, binding) {
        showBig(el, binding);
    }
});

function showBig(el, binding) {
    let attr = binding.value;
    let result = [];
    let index = 0;
    if (attr) {
        index = attr['index'] || 0;
        if (attr.hasOwnProperty('ids') && attr['ids']) {
            attr['ids'].split(',').forEach(item => {
                result.push(process.env.VUE_APP_FILE_URL + item);
            });
        } else if (attr.hasOwnProperty('imgs') && attr['imgs']) {
            result = result.concat(attr['imgs']);
        }else {
            if (el.nodeName === 'IMG') {
                result.push(el.src);
            }
        }
    } else {
        if (el.nodeName === 'IMG'&&el.src) {
            result.push(el.src);
        }else if(el.nodeName === 'IMG'){ //有可能有延迟 列入二维码
            setTimeout(() => {
                result.push(el.src);
            }, 500);
        }else{
            let img = el.getElementsByTagName('img');
            result.push(img[0].src);
        }
    }
    //点击事件
    el.addEventListener('click',  (event) => {
        event.stopPropagation();
        ImagePreview({images: result, startPosition: index});
    });
}

export default {
    viewImage: showImage
}
