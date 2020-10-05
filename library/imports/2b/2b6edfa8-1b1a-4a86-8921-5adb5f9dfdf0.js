"use strict";
cc._RF.push(module, '2b6ed+oGxpKhokhWttfnf3w', 'util');
// scripts/util.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handler_pool = [];
var handler_pool_size = 10;
//用于绑定回调函数this指针
var handler = /** @class */ (function () {
    function handler() {
    }
    handler.prototype.init = function (cb, host) {
        if (host === void 0) { host = null; }
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.cb = cb;
        this.host = host;
        this.args = args;
    };
    handler.prototype.exec = function () {
        var extras = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            extras[_i] = arguments[_i];
        }
        this.cb.apply(this.host, this.args.concat(extras));
    };
    return handler;
}());
exports.handler = handler;
function gen_handler(cb, host) {
    if (host === void 0) { host = null; }
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var single_handler = handler_pool.length < 0 ? handler_pool.pop() : new handler();
    //这里要展开args, 否则会将args当数组传给wrapper, 导致其args参数变成2维数组[[]]
    single_handler.init.apply(single_handler, [cb, host].concat(args));
    return single_handler;
}
exports.gen_handler = gen_handler;
function strfmt(fmt) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return fmt.replace(/\{(\d+)\}/g, function (match, argIndex) {
        return args[argIndex] || match;
    });
}
exports.strfmt = strfmt;
function extend(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < sources.length; i += 1) {
        var source = sources[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
exports.extend = extend;
function createBreathAction(node, min, max) {
    if (min === void 0) { min = 0.9; }
    if (max === void 0) { max = 1.1; }
    var action = cc.repeatForever(cc.sequence(cc.scaleTo(0.6, max), cc.scaleTo(0.6, min)));
    node.runAction(action);
}
exports.createBreathAction = createBreathAction;
function destroyBreathAction(node) {
    node.stopAllActions();
}
exports.destroyBreathAction = destroyBreathAction;
function getRandom(n, m) {
    var num = Math.floor(Math.random() * (m - n + 1) + n);
    return num;
}
exports.getRandom = getRandom;
/**
 * @desc 碰撞检测
 * @param pointA {object} A目标坐标、半径
 * @param pointB {object} B目标坐标、半径
 * @return {boolean} 是否重叠
 */
function testOverlay(pointA, pointB, R) {
    var xGap = Math.abs(pointA.x - pointB.x);
    var yGap = Math.abs(pointA.y - pointB.y);
    var distance = Math.sqrt(xGap * xGap + yGap * yGap);
    var rGap = R * 2;
    return distance >= rGap;
}
/**
 * @desc 有效点检测
 * @param pointArr {array} 已有点坐标、半径集合数组
 * @param newPoint {object} 新点坐标、半径
 * @return {boolean} 新点是否有效
 */
function testAvailable(pointArr, newPoint, R) {
    var arr = Array.from(pointArr);
    var aval = true;
    while (arr.length > 0) {
        var lastPoint = arr.pop();
        if (testOverlay(lastPoint, newPoint, R)) {
            aval = false;
            break;
        }
    }
    return aval;
}
function randomMinus1To1() {
    return (Math.random() - 0.5) * 2;
}
exports.randomMinus1To1 = randomMinus1To1;

cc._RF.pop();