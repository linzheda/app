import pageHeader from '@/components/pageHeader/pageHeader.vue'
const components={
    install(Vue){
        Vue.component('page-header',pageHeader)
    }
}
//判断
if(typeof window !=='undefined' && window.Vue){
    // eslint-disable-next-line no-undef
    install(window.Vue);
}

export default components;