const PI = 3.14159265358979324;
// eslint-disable-next-line no-unused-vars
const x_pi = 3.14159265358979324 * 3000.0 / 180.0;

class gis {

    /**
     * 是否超出中国坐标范围
     * @param lat 纬度
     * @param lon 经度
     * @returns {boolean}
     */
    static outOfChina(lat, lon) {
        if (lon < 72.004 || lon > 137.8347) {
            return true;
        }
        if (lat < 0.8293 || lat > 55.8271) {
            return true;
        }
        return false;
    }

    /**
     * 纬度转换
     * @param x
     * @param y
     * @returns {number}
     */
    static transformLat(x, y) {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * PI) + 40.0 * Math.sin(y / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * PI) + 320 * Math.sin(y * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    /**
     * 经度转换
     * @param x
     * @param y
     * @returns {any}
     */
    static transformLon(x, y) {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * PI) + 40.0 * Math.sin(x / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * PI) + 300.0 * Math.sin(x / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    /**
     * 经纬度处理
     * @param lat 纬度
     * @param lon 经度
     * @returns {{lat: number, lon: any}}
     */
    static delta(lat, lon) {
        const a = 6378245.0;
        const ee = 0.00669342162296594323;
        let dLat = this.transformLat(lon - 105.0, lat - 35.0);
        let dLon = this.transformLon(lon - 105.0, lat - 35.0);
        const radLat = lat / 180.0 * PI;
        let magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * PI);
        return {'lat': dLat, 'lon': dLon};
    }

    /**
     * WGS-84(GPS) to GCJ-02(Google地图、高德、腾讯)
     * @param wgsLat
     * @param wgsLon
     * @returns {{lat: any, lon: any}}
     */
    static gcj_encrypt(wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon)) {
            return {'lat': wgsLat, 'lon': wgsLon};
        }
        const d = this.delta(wgsLat, wgsLon);
        return {'lat': wgsLat + d.lat, 'lon': wgsLon + d.lon};
    }

    /**
     * GCJ-02(Google地图、高德、腾讯) to WGS-84(GPS) 粗略
     * @param gcjLat 纬度
     * @param gcjLon 经度
     * @returns {{lat: any, lon: any}}
     */
    static gcj_decrypt(gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon)) {
            return {'lat': gcjLat, 'lon': gcjLon};
        }
        const d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    }

    /**
     * GCJ-02(Google地图、高德、腾讯) to WGS-84(GPS) exactly 精确(二分极限法)
     * @param gcjLat 纬度
     * @param gcjLon 经度
     * @returns {{lat: any, lon: any}}
     */
    static gcj_decrypt_exact(gcjLat, gcjLon) {
        const initDelta = 0.01;
        const threshold = 0.000000001;
        let dLat = initDelta, dLon = initDelta;
        let mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        let pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        let wgsLat, wgsLon, i = 0;
        // eslint-disable-next-line no-constant-condition
        while (1 === 1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            const tmp = this.gcj_encrypt(wgsLat, wgsLon);
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold)) {
                break;
            }
            if (dLat > 0) {
                pLat = wgsLat;
            } else {
                mLat = wgsLat;
            }
            if (dLon > 0) {
                pLon = wgsLon;
            } else {
                mLon = wgsLon;
            }
            if (++i > 10000) {
                break;
            }
        }
        return {'lat': wgsLat, 'lon': wgsLon};
    }

    /**
     * 两点间距离计算
     * @param latA A点纬度
     * @param logA A点经度
     * @param latB B点纬度
     * @param logB B点经度
     * @returns {number}
     */
    static distance(latA, logA, latB, logB) {
        const earthR = 6371000;
        const x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((logA - logB) * Math.PI / 180);
        const y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180);
        let s = x + y;
        if (s > 1) {
            s = 1;
        }
        if (s < -1) {
            s = -1;
        }
        const alpha = Math.acos(s);
        return alpha * earthR;
    }

}

export default gis