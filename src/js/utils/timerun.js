/**
 * 节流运行
 * @param {Function} fn
 * @param {number} interval
 * @returns
 */
let throttle = function (fn, interval) {
    let _self = fn,
        timer,
        firstTime = true;

    return function () {
        let args = arguments,
            _me = this;

        if (firstTime) {
            _self.apply(_me, args);
            return firstTime = false;
        }

        if (timer) {
            return false;
        }

        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            _self.apply(_me, args);
        }, interval || 500);
    };
};

/**
 * [分时函数运行]
 * @param  {[type]}   ary   [description]
 * @param  {Function} fn    [description]
 * @param  {[type]}   count [description]
 * @return {[type]}         [description]
 */
let timeChunk = function (ary, fn, count) {
    let obj,
        t;
    let len = ary.length;
    let start = () => {
        for (let i = 0; i < Math.min(count || 1, ary.length); i++) {
            let obj = ary.shift();
            fn(obj);
        }
    };

    return function () {
        t = setInterval(() => {
            if (ary.length === 0) {
                return clearInterval(t);
            }
            start();
        }, 200);
    };
};

export default {
    throttle,
    timeChunk
};