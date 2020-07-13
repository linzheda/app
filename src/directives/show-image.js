import Vue from 'vue';

const showImage = Vue.directive('show-image', {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function (el) {
        el.style.cursor = 'pointer';
        el.title = '点击可查看大图';

        // 图片外壳
        let imgBox = document.createElement('div');
        // 图片
        let img = document.createElement('img');
        // 这个查看图片包含框
        let div = document.createElement('div');
        div.className = 'view-image-container';
        imgBox.appendChild(img);
        div.appendChild(imgBox);
        div.style.visibility = 'hidden';
        document.body.appendChild(div);
        el.addEventListener('click', function () {
            img.src = el.src;
            div.style.visibility = 'visible';
        });
        // 点击关闭按钮隐藏查看大图
        div.addEventListener('click', function () {
            div.style.visibility = 'hidden';
        });
    }
});

export default {
    viewImage: showImage
}
