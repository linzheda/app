import utils from "@/utils/utils";
import store from '../store'
import router from '@/router'

class permissions {
    //返回按钮级权限有多少个
    static hasCnt(flag, meta) {
        let result = 0;
        let arr;
        if (utils.isNotEmpty(meta['btnPermissions'])) {
            arr = meta['btnPermissions'].split(",");
        } else {
            return 0;
        }
        //校验
        if (flag.includes('||')) {
            let values = flag.split('||');
            for (let item of arr) {
                if (values.includes(item)) {
                    result++;
                }
            }
        } else {
            for (let item of arr) {
                if (item === flag) {
                    result = 1;
                    break;
                }
            }
        }
        return result;
    }

    //初始化路由
    static initRoutes() {
        this.getTabsRoutes()
    }

    //获取tabs的路由
    static getTabsRoutes(route = null) {
        let pid = route ? getThisRoute(route)['id'] : '-2';
        store.dispatch('getAppMenus', pid).then(res => {
            let home = res[0];
            store.dispatch('getAppMenus', home['id']).then(res2 => {
                home['children'] = res2;
                store.dispatch('addRoutes', [home]).then(() => {
                    router.replace({name: home['name'], params: {direction: 'replace'}})
                })
            });
        })
    }

    //获取当前路由下的子路由
    static getMenuList(route) {
        return new Promise((resolve) => {
            let thisRoute = getThisRoute(route);
            store.dispatch('getAppMenus', thisRoute['id']).then(res => {
                store.dispatch('addRoutes', res).then(() => {
                    let result = doIcon(res);
                    resolve(result);
                })
            })
        });
    }

    //获取当前路由
    static getCurrentRoute(route) {
        return getThisRoute(route)
    }

    //新增路由
    static addRoute(route) {
        let routes = [];
        if (Array.isArray(route)) {
            route.forEach(item => {
                if (typeof item == 'string') {
                    route = {name: item};
                }
                routes.push(route);
            });
        } else if (typeof route == 'object') {
            routes.push(route)
        } else if (typeof route == 'string') {
            routes.push({name: route});
        }
        return new Promise((resolve) => {
            store.dispatch('addRoutes', routes, true).then(res => {
                let result = doIcon(res);
                resolve(result);
            });
        });
    }

}


function getThisRoute(route) {
    return getTreeNode(store.getters.menus, route);
}

function getTreeNode(data, obj) {
    let hasFound = false, // 表示是否有找到id值
        result = null;
    let fn = function (data) {
        if (Array.isArray(data) && !hasFound) { // 判断是否是数组并且没有的情况下，
            data.forEach(item => {
                if (item.name === obj.name) { // 数据循环每个子项，并且判断子项下边是否有id值
                    result = item; // 返回的结果等于每一项
                    hasFound = true; // 并且找到id值
                } else if (item.children) {
                    fn(item.children); // 递归调用下边的子项
                }
            })
        } else {
            if (data.name === obj.name) { // 数据循环每个子项，并且判断子项下边是否有id值
                result = data; // 返回的结果等于每一项
                hasFound = true; // 并且找到id值
            }
        }
    }
    fn(data); // 调用一下
    return result;
}

//处理图片
function doIcon(res) {
    res.forEach(item => {
        if (item['meta'] && utils.isNotEmpty(item['meta']['icon']) && item['meta']['icon'].includes(".")) {
            item['meta']['icon'] = require("@/assets/images/" + item.meta.icon);
        }
        if (item.children) {
            item.children.forEach(item2 => {
                if (item2['meta'] &&utils.isNotEmpty(item2['meta']['icon']) && item2['meta']['icon'].includes(".")) {
                    item2['meta']['icon'] = require("@/assets/images/" + item2.meta.icon);
                }
            });
        }
    });
    return res;
}


export default permissions;