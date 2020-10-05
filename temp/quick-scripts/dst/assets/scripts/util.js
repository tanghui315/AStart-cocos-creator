
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/util.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJLFlBQVksR0FBYSxFQUFFLENBQUM7QUFDaEMsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFFM0IsZ0JBQWdCO0FBQ2hCO0lBTUk7SUFBYyxDQUFDO0lBRWYsc0JBQUksR0FBSixVQUFLLEVBQVcsRUFBRSxJQUFXO1FBQVgscUJBQUEsRUFBQSxXQUFXO1FBQUUsY0FBTzthQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87WUFBUCw2QkFBTzs7UUFFbEMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRUQsc0JBQUksR0FBSjtRQUFLLGdCQUFTO2FBQVQsVUFBUyxFQUFULHFCQUFTLEVBQVQsSUFBUztZQUFULDJCQUFTOztRQUVWLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0wsY0FBQztBQUFELENBbkJBLEFBbUJDLElBQUE7QUFuQlksMEJBQU87QUFxQnBCLFNBQWdCLFdBQVcsQ0FBQyxFQUFXLEVBQUUsSUFBZTtJQUFmLHFCQUFBLEVBQUEsV0FBZTtJQUFFLGNBQWE7U0FBYixVQUFhLEVBQWIscUJBQWEsRUFBYixJQUFhO1FBQWIsNkJBQWE7O0lBRW5FLElBQUksY0FBYyxHQUFXLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUEsQ0FBQyxDQUFDLElBQUksT0FBTyxFQUFFLENBQUE7SUFDeEYsc0RBQXNEO0lBQ3RELGNBQWMsQ0FBQyxJQUFJLE9BQW5CLGNBQWMsR0FBTSxFQUFFLEVBQUUsSUFBSSxTQUFLLElBQUksR0FBRTtJQUN2QyxPQUFPLGNBQWMsQ0FBQztBQUMxQixDQUFDO0FBTkQsa0NBTUM7QUFFRCxTQUFnQixNQUFNLENBQUMsR0FBVTtJQUFFLGNBQWE7U0FBYixVQUFhLEVBQWIscUJBQWEsRUFBYixJQUFhO1FBQWIsNkJBQWE7O0lBRTVDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsVUFBQyxLQUFZLEVBQUUsUUFBZTtRQUMzRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBTEQsd0JBS0M7QUFFRCxTQUFnQixNQUFNLENBQUMsTUFBTTtJQUFFLGlCQUFVO1NBQVYsVUFBVSxFQUFWLHFCQUFVLEVBQVYsSUFBVTtRQUFWLGdDQUFVOztJQUNyQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3hDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtZQUNwQixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDN0I7U0FDSjtLQUNKO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQVZELHdCQVVDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUMsSUFBWSxFQUFFLEdBQVMsRUFBRSxHQUFTO0lBQXBCLG9CQUFBLEVBQUEsU0FBUztJQUFFLG9CQUFBLEVBQUEsU0FBUztJQUVqRSxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUpELGdEQUlDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsSUFBWTtJQUU1QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDMUIsQ0FBQztBQUhELGtEQUdDO0FBRUQsU0FBZ0IsU0FBUyxDQUFFLENBQVEsRUFBRSxDQUFRO0lBQ3pDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtJQUNyRCxPQUFPLEdBQUcsQ0FBQTtBQUNkLENBQUM7QUFIRCw4QkFHQztBQUVEOzs7OztHQUtHO0FBQ0gsU0FBUyxXQUFXLENBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFRO0lBQzVDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDMUMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMxQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQ3JELElBQU0sSUFBSSxHQUFHLENBQUMsR0FBQyxDQUFDLENBQUE7SUFDaEIsT0FBTyxRQUFRLElBQUksSUFBSSxDQUFBO0FBQ3hCLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsYUFBYSxDQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsQ0FBUTtJQUMvQyxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzlCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNmLE9BQU0sR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEIsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ3pCLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDdEMsSUFBSSxHQUFHLEtBQUssQ0FBQTtZQUNaLE1BQU07U0FDUDtLQUNGO0lBQ0QsT0FBTyxJQUFJLENBQUE7QUFDZixDQUFDO0FBRUQsU0FBZ0IsZUFBZTtJQUMzQixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBRkQsMENBRUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgaGFuZGxlcl9wb29sOmhhbmRsZXJbXSA9IFtdO1xubGV0IGhhbmRsZXJfcG9vbF9zaXplID0gMTA7XG5cbi8v55So5LqO57uR5a6a5Zue6LCD5Ye95pWwdGhpc+aMh+mSiFxuZXhwb3J0IGNsYXNzIGhhbmRsZXJcbntcbiAgICBwcml2YXRlIGNiOkZ1bmN0aW9uO1xuICAgIHByaXZhdGUgaG9zdDphbnk7XG4gICAgcHJpdmF0ZSBhcmdzOmFueVtdO1xuXG4gICAgY29uc3RydWN0b3IoKXt9XG5cbiAgICBpbml0KGNiOkZ1bmN0aW9uLCBob3N0ID0gbnVsbCwgLi4uYXJncylcbiAgICB7XG4gICAgICAgIHRoaXMuY2IgPSBjYjtcbiAgICAgICAgdGhpcy5ob3N0ID0gaG9zdDtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG5cbiAgICBleGVjKC4uLmV4dHJhcylcbiAgICB7XG4gICAgICAgIHRoaXMuY2IuYXBwbHkodGhpcy5ob3N0LCB0aGlzLmFyZ3MuY29uY2F0KGV4dHJhcykpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbl9oYW5kbGVyKGNiOkZ1bmN0aW9uLCBob3N0OmFueSA9IG51bGwsIC4uLmFyZ3M6YW55W10pOmhhbmRsZXJcbntcbiAgICBsZXQgc2luZ2xlX2hhbmRsZXI6aGFuZGxlciA9IGhhbmRsZXJfcG9vbC5sZW5ndGggPCAwID8gaGFuZGxlcl9wb29sLnBvcCgpOiBuZXcgaGFuZGxlcigpXG4gICAgLy/ov5nph4zopoHlsZXlvIBhcmdzLCDlkKbliJnkvJrlsIZhcmdz5b2T5pWw57uE5Lyg57uZd3JhcHBlciwg5a+86Ie05YW2YXJnc+WPguaVsOWPmOaIkDLnu7TmlbDnu4RbW11dXG4gICAgc2luZ2xlX2hhbmRsZXIuaW5pdChjYiwgaG9zdCwgLi4uYXJncyk7XG4gICAgcmV0dXJuIHNpbmdsZV9oYW5kbGVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RyZm10KGZtdDpzdHJpbmcsIC4uLmFyZ3M6YW55W10pXG57XG4gICAgcmV0dXJuIGZtdC5yZXBsYWNlKC9cXHsoXFxkKylcXH0vZywgKG1hdGNoOnN0cmluZywgYXJnSW5kZXg6bnVtYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBhcmdzW2FyZ0luZGV4XSB8fCBtYXRjaDtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQsIC4uLnNvdXJjZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUJyZWF0aEFjdGlvbihub2RlOmNjLk5vZGUsIG1pbiA9IDAuOSwgbWF4ID0gMS4xKVxue1xuICAgIGNvbnN0IGFjdGlvbiA9IGNjLnJlcGVhdEZvcmV2ZXIoY2Muc2VxdWVuY2UoY2Muc2NhbGVUbygwLjYsIG1heCksIGNjLnNjYWxlVG8oMC42LCBtaW4pKSk7XG4gICAgbm9kZS5ydW5BY3Rpb24oYWN0aW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lCcmVhdGhBY3Rpb24obm9kZTpjYy5Ob2RlKVxue1xuICAgIG5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRvbSAobjpudW1iZXIsIG06bnVtYmVyKSB7XG4gICAgdmFyIG51bSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtIC0gbiArIDEpICsgbilcbiAgICByZXR1cm4gbnVtXG59XG5cbi8qKlxuICogQGRlc2Mg56Kw5pKe5qOA5rWLXG4gKiBAcGFyYW0gcG9pbnRBIHtvYmplY3R9IEHnm67moIflnZDmoIfjgIHljYrlvoRcbiAqIEBwYXJhbSBwb2ludEIge29iamVjdH0gQuebruagh+WdkOagh+OAgeWNiuW+hFxuICogQHJldHVybiB7Ym9vbGVhbn0g5piv5ZCm6YeN5Y+gXG4gKi9cbmZ1bmN0aW9uIHRlc3RPdmVybGF5IChwb2ludEEsIHBvaW50QixSOm51bWJlcikge1xuXHRjb25zdCB4R2FwID0gTWF0aC5hYnMocG9pbnRBLnggLSBwb2ludEIueClcblx0Y29uc3QgeUdhcCA9IE1hdGguYWJzKHBvaW50QS55IC0gcG9pbnRCLnkpXG5cdGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KHhHYXAgKiB4R2FwICsgeUdhcCAqIHlHYXApXG5cdGNvbnN0IHJHYXAgPSBSKjJcblx0cmV0dXJuIGRpc3RhbmNlID49IHJHYXBcbn1cblxuLyoqXG4gKiBAZGVzYyDmnInmlYjngrnmo4DmtYtcbiAqIEBwYXJhbSBwb2ludEFyciB7YXJyYXl9IOW3suacieeCueWdkOagh+OAgeWNiuW+hOmbhuWQiOaVsOe7hFxuICogQHBhcmFtIG5ld1BvaW50IHtvYmplY3R9IOaWsOeCueWdkOagh+OAgeWNiuW+hFxuICogQHJldHVybiB7Ym9vbGVhbn0g5paw54K55piv5ZCm5pyJ5pWIXG4gKi9cbmZ1bmN0aW9uIHRlc3RBdmFpbGFibGUgKHBvaW50QXJyLCBuZXdQb2ludCxSOm51bWJlcikge1xuICAgIGxldCBhcnIgPSBBcnJheS5mcm9tKHBvaW50QXJyKVxuICAgIGxldCBhdmFsID0gdHJ1ZVxuICAgIHdoaWxlKGFyci5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgbGFzdFBvaW50ID0gYXJyLnBvcCgpXG4gICAgICBpZiAodGVzdE92ZXJsYXkobGFzdFBvaW50LCBuZXdQb2ludCxSKSkge1xuICAgICAgICBhdmFsID0gZmFsc2VcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhdmFsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21NaW51czFUbzEoKXtcbiAgICByZXR1cm4gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMjtcbn0iXX0=