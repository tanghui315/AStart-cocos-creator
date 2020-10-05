
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, 'a5be5b7dlZK8IteAYlqYHH8', 'game');
// scripts/game.ts

"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
//定义数据类型
var AStarNode = /** @class */ (function () {
    function AStarNode(x, y) {
        /** 已使用步数 ：从开始节点到当前节点已使用的步数 **/
        this.usedSteps = 0;
        //代表斜角度
        this.isDiag = false;
        this.x = x;
        this.y = y;
    }
    return AStarNode;
}());
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.text = 'hello';
        _this._straightCost = 1.0; //上下左右走的代价
        _this._diagCost = Math.SQRT2; //斜着走的代价 
        _this._cellSize = 30;
        //定义八方向 [x y]
        _this.stepArray = [[0, -1], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
        // LIFE-CYCLE CALLBACKS:
        //待访问节点
        _this.readyList = [];
        _this.visitedList = [];
        return _this;
        // update (dt) {}
    }
    //找邻居节点
    Game.prototype.findNeighbour = function (node) {
        //初始化node
        var resultList = [];
        // 获取8个节点的坐标并判断有效性
        for (var index = 0; index < 8; index++) {
            var step = this.stepArray[index];
            var isDiag = false;
            if (step[0] != 0 && step[1] != 0) {
                isDiag = true; //代表斜着的方向
            }
            var r = this._cellSize;
            var x = node.x + (step[0] * r);
            var y = node.y + (step[1] * r);
            // 坐标越界判断
            console.log(x, y);
            if (Math.abs(x) > (this._bg.width / 2 - 30) || Math.abs(y) > 300) {
                continue;
            }
            //监测是否是碰撞的
            if (this.testOverlay(x, y)) {
                continue;
            }
            //斜着块特殊情况，是不是碰撞的，特殊处理上下左右有障碍物不能斜着走
            if (isDiag) {
                var y1 = y + (-30);
                var y2 = y + 30;
                var x1 = x + (-30);
                var x2 = x + 30;
                if (this.testOverlay(x, y1) || this.testOverlay(x, y2) || this.testOverlay(x1, y) || this.testOverlay(x2, y)) { //这个点排除掉
                    continue;
                }
            }
            //判断是否在已访问节点
            if (this.findNode(this.visitedList, x, y) != null) {
                continue;
            }
            var nnode = new AStarNode(x, y);
            nnode.isDiag = isDiag;
            resultList.push(nnode);
            //this.buildReadyNode(nnode.x,nnode.y)
            //判断是不是碰撞到终点-不在这里
        }
        return resultList;
    };
    //搜索核心逻辑
    Game.prototype.aStarSearch = function () {
        var haveEndNode = null;
        this.readyList.push(this._startNode);
        while (this.readyList.length > 0) {
            var minNode = this.getMinNode(this.readyList);
            this.readyList = this.removeListNode(this.readyList, minNode);
            this.visitedList.push(minNode);
            var list = this.findNeighbour(minNode); //找相邻节点
            for (var index = 0; index < list.length; index++) {
                var neighbourNode = list[index];
                this.initNode(minNode, neighbourNode);
                var tmpNode = this.findNode(this.readyList, neighbourNode.x, neighbourNode.y);
                if (tmpNode == null) {
                    this.readyList.push(neighbourNode);
                }
                else if (neighbourNode.expectedSteps < tmpNode.expectedSteps) {
                    this.readyList = this.removeListNode(this.readyList, tmpNode);
                    this.readyList.push(neighbourNode);
                }
            }
            //判断是否碰撞到终点
            haveEndNode = this.findEndNodeByReadList();
            if (haveEndNode != null) {
                break;
            }
        }
        return haveEndNode;
    };
    Game.prototype.findEndNodeByReadList = function () {
        var _endReadyNode = null;
        for (var index = 0; index < this.readyList.length; index++) {
            var node = this.readyList[index];
            if (this.isInEndNode(node.x, node.y)) {
                _endReadyNode = node;
                break;
            }
        }
        return _endReadyNode;
    };
    //判断是否碰撞到终点
    Game.prototype.isInEndNode = function (x, y) {
        var minX = this._endNode.x - (this._cellSize / 2); //正方形格子，比较简单
        var maxX = this._endNode.x + (this._cellSize / 2);
        var minY = this._endNode.y - (this._cellSize / 2);
        var maxY = this._endNode.y + (this._cellSize / 2);
        if (x <= maxX && x >= minX && y <= maxY && y >= minY) {
            return true;
        }
        else {
            return false;
        }
    };
    //计算节点和期望步数 
    Game.prototype.initNode = function (parent, node) {
        var cost = node.isDiag ? this._diagCost : this._straightCost;
        var usedSteps = cost;
        if (parent) {
            usedSteps = parent.usedSteps + cost;
        }
        node.parent = parent;
        node.usedSteps = usedSteps;
        node.distance = this.diagonal(node); //计算距离
        node.expectedSteps = node.usedSteps + node.distance; // 期望步数
    };
    Game.prototype.removeListNode = function (listNode, delNode) {
        var list = [];
        for (var index = 0; index < listNode.length; index++) {
            var node = listNode[index];
            if (node.x != delNode.x || node.y != delNode.y) {
                list.push(node);
            }
        }
        return list;
    };
    //计算期望最小的节点
    Game.prototype.getMinNode = function (listNode) {
        if (!listNode || listNode.length == 0) {
            return null;
        }
        else if (listNode.length == 1) {
            return listNode[0];
        }
        var minNode = listNode[0];
        for (var index = 0; index < listNode.length; index++) {
            var node = listNode[index];
            if (node.expectedSteps < minNode.expectedSteps) {
                minNode = node;
            }
        }
        return minNode;
    };
    //用cocos内置的去监测
    Game.prototype.testOverlay = function (x, y) {
        // let v = new cc.Vec2(x, y)
        var rect = new cc.Rect((x - 30 * 0.5), (y - 30 * 0.5), 30, 30);
        var isHit = false;
        for (var index = 0; index < this._wall.length; index++) {
            var node = this._wall[index];
            //isHit = node.getBoundingBox().contains(v)
            isHit = cc.Intersection.rectRect(rect, node.getBoundingBox());
            //isHit = cc.Intersection.pointInPolygon(v,node.getComponent(cc.BoxCollider).world.points)
            if (isHit) {
                break;
            }
        }
        return isHit;
    };
    Game.prototype.findNode = function (listNode, x, y) {
        var haveNode = null;
        for (var index = 0; index < listNode.length; index++) {
            var node = listNode[index];
            if (node.x == x && node.y == y) {
                haveNode = node;
                break;
            }
        }
        return haveNode;
    };
    Game.prototype.onLoad = function () {
        //cc.director.getCollisionManager().enabled = true;
        this._bg = cc.find('Canvas/Bg');
        var wall = cc.find("Canvas/wall");
        this._wall = wall.children;
        //监控点击
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.clickSearch.bind(this));
    };
    Game.prototype.clickSearch = function (event) {
        //清空重来
        this.readyList = [];
        this.visitedList = [];
        var startNode = cc.find('Canvas/start-node');
        this._startNode = new AStarNode(startNode.x, startNode.y);
        this._startNode.startNode = startNode;
        //转换成局部坐标
        var p = this.node.convertToNodeSpaceAR(event.getLocation());
        this._endNode = new AStarNode(p.x, p.y);
        //console.log(this.testOverlay(p.x,p.y))
        var node = this.aStarSearch();
        if (node == null) {
            console.log('终点不可达');
            return;
        }
        //开始移动方块
        //构建动作数组
        var actionArr = [];
        actionArr.push(cc.moveTo(0.5, new cc.Vec2(node.x, node.y)));
        while (node.parent != null) {
            var tmp = node.parent;
            actionArr.push(cc.moveTo(0.5, new cc.Vec2(tmp.x, tmp.y)));
            node = tmp;
        }
        actionArr.reverse();
        this._startNode.startNode.runAction(cc.sequence(actionArr));
    };
    //构建ready节点位置
    Game.prototype.buildReadyNode = function (x, y) {
        var self = this;
        cc.loader.loadRes("perfab/ready-node", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            newNode.x = x;
            newNode.y = y;
            self.node.addChild(newNode);
        });
    };
    // start() {
    // }
    //曼哈顿算法
    Game.prototype.manhattan = function (node) {
        return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
    };
    Game.prototype.euclidian = function (node) {
        var dx = node.x - this._endNode.x;
        var dy = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    };
    Game.prototype.diagonal = function (node) {
        var dx = Math.abs(node.x - this._endNode.x);
        var dy = Math.abs(node.y - this._endNode.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    };
    __decorate([
        property(cc.Label)
    ], Game.prototype, "label", void 0);
    __decorate([
        property
    ], Game.prototype, "text", void 0);
    Game = __decorate([
        ccclass
    ], Game);
    return Game;
}(cc.Component));
exports.default = Game;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0cy9zY3JpcHRzL2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9CQUFvQjtBQUNwQix3RUFBd0U7QUFDeEUsbUJBQW1CO0FBQ25CLGtGQUFrRjtBQUNsRiw4QkFBOEI7QUFDOUIsa0ZBQWtGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFbEYsUUFBUTtBQUNSO0lBa0JJLG1CQUFZLENBQVMsRUFBRSxDQUFTO1FBYmhDLCtCQUErQjtRQUMvQixjQUFTLEdBQVcsQ0FBQyxDQUFBO1FBT3JCLE9BQU87UUFDUCxXQUFNLEdBQVksS0FBSyxDQUFBO1FBS25CLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDZCxDQUFDO0lBRUwsZ0JBQUM7QUFBRCxDQXZCQSxBQXVCQyxJQUFBO0FBRUssSUFBQSxrQkFBcUMsRUFBbkMsb0JBQU8sRUFBRSxzQkFBMEIsQ0FBQztBQUc1QztJQUFrQyx3QkFBWTtJQUQ5QztRQUFBLHFFQTRRQztRQXhRRyxXQUFLLEdBQWEsSUFBSSxDQUFDO1FBR3ZCLFVBQUksR0FBVyxPQUFPLENBQUM7UUFHZixtQkFBYSxHQUFXLEdBQUcsQ0FBQyxDQUFLLFVBQVU7UUFDM0MsZUFBUyxHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBRSxTQUFTO1FBQzFDLGVBQVMsR0FBVyxFQUFFLENBQUE7UUFHOUIsYUFBYTtRQUNMLGVBQVMsR0FBeUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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LENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM5RSxDQUFDO0lBclFEO1FBREMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7dUNBQ0k7SUFHdkI7UUFEQyxRQUFRO3NDQUNjO0lBTk4sSUFBSTtRQUR4QixPQUFPO09BQ2EsSUFBSSxDQTJReEI7SUFBRCxXQUFDO0NBM1FELEFBMlFDLENBM1FpQyxFQUFFLENBQUMsU0FBUyxHQTJRN0M7a0JBM1FvQixJQUFJIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTGVhcm4gVHlwZVNjcmlwdDpcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3R5cGVzY3JpcHQuaHRtbFxuLy8gTGVhcm4gQXR0cmlidXRlOlxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXG5cbi8v5a6a5LmJ5pWw5o2u57G75Z6LXG5jbGFzcyBBU3Rhck5vZGUge1xuICAgIC8qKiDooYzlnZDmoIcgKiovXG4gICAgeDogbnVtYmVyXG4gICAgLyoqIOWIl+WdkOaghyAqKi9cbiAgICB5OiBudW1iZXJcbiAgICAvKiog5bey5L2/55So5q2l5pWwIO+8muS7juW8gOWni+iKgueCueWIsOW9k+WJjeiKgueCueW3suS9v+eUqOeahOatpeaVsCAqKi9cbiAgICB1c2VkU3RlcHM6IG51bWJlciA9IDBcbiAgICAvKiog6aKE5Lyw6Led56a7IO+8muW9k+WJjeiKgueCueWIsOebruagh+iKgueCueaXoOinhumanOeijeeahOi3neemuyAqKi9cbiAgICBkaXN0YW5jZTogbnVtYmVyXG4gICAgLyoqIOacn+acm+atpeaVsCA9IOW3suS9v+eUqOatpeaVsCvml6Dpmpznoo3ot53nprsgKiovXG4gICAgZXhwZWN0ZWRTdGVwczogbnVtYmVyXG4gICAgLyoqIOeItuiKgueCue+8muaJk+WNsOi3r+W+hOaXtumcgOimgSAqKi9cbiAgICBwYXJlbnQ6IEFTdGFyTm9kZVxuICAgIC8v5Luj6KGo5pac6KeS5bqmXG4gICAgaXNEaWFnOiBib29sZWFuID0gZmFsc2VcblxuICAgIHN0YXJ0Tm9kZTogY2MuTm9kZVxuXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy54ID0geFxuICAgICAgICB0aGlzLnkgPSB5XG4gICAgfVxuXG59XG5cbmNvbnN0IHsgY2NjbGFzcywgcHJvcGVydHkgfSA9IGNjLl9kZWNvcmF0b3I7XG5cbkBjY2NsYXNzXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lIGV4dGVuZHMgY2MuQ29tcG9uZW50IHtcblxuICAgIEBwcm9wZXJ0eShjYy5MYWJlbClcbiAgICBsYWJlbDogY2MuTGFiZWwgPSBudWxsO1xuXG4gICAgQHByb3BlcnR5XG4gICAgdGV4dDogc3RyaW5nID0gJ2hlbGxvJztcbiAgICBwcml2YXRlIF9zdGFydE5vZGU6IEFTdGFyTm9kZTtcbiAgICBwcml2YXRlIF9lbmROb2RlOiBBU3Rhck5vZGUgIC8vIOebruagh+eCuVxuICAgIHByaXZhdGUgX3N0cmFpZ2h0Q29zdDogbnVtYmVyID0gMS4wOyAgICAgLy/kuIrkuIvlt6blj7PotbDnmoTku6Pku7dcbiAgICBwcml2YXRlIF9kaWFnQ29zdDogbnVtYmVyID0gTWF0aC5TUVJUMjsgIC8v5pac552A6LWw55qE5Luj5Lu3IFxuICAgIHByaXZhdGUgX2NlbGxTaXplOiBudW1iZXIgPSAzMFxuICAgIHByaXZhdGUgX2JnOiBjYy5Ob2RlXG4gICAgcHJpdmF0ZSBfd2FsbDogQXJyYXk8Y2MuTm9kZT4gLy/lopnnmoToioLngrlcbiAgICAvL+WumuS5ieWFq+aWueWQkSBbeCB5XVxuICAgIHByaXZhdGUgc3RlcEFycmF5OiBBcnJheTxBcnJheTxudW1iZXI+PiA9IFtbMCwgLTFdLCBbMCwgMV0sIFsxLCAwXSwgWy0xLCAwXSwgWzEsIDFdLCBbLTEsIC0xXSwgWzEsIC0xXSwgWy0xLCAxXV1cbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcbiAgICAvL+W+heiuv+mXruiKgueCuVxuICAgIHByaXZhdGUgcmVhZHlMaXN0OiBBcnJheTxBU3Rhck5vZGU+ID0gW11cbiAgICBwcml2YXRlIHZpc2l0ZWRMaXN0OiBBcnJheTxBU3Rhck5vZGU+ID0gW11cbiAgICAvL+aJvumCu+WxheiKgueCuVxuICAgIHByaXZhdGUgZmluZE5laWdoYm91cihub2RlOiBBU3Rhck5vZGUpIHtcbiAgICAgICAgLy/liJ3lp4vljJZub2RlXG4gICAgICAgIGxldCByZXN1bHRMaXN0ID0gW11cbiAgICAgICAgLy8g6I635Y+WOOS4quiKgueCueeahOWdkOagh+W5tuWIpOaWreacieaViOaAp1xuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgODsgaW5kZXgrKykge1xuICAgICAgICAgICAgbGV0IHN0ZXAgPSB0aGlzLnN0ZXBBcnJheVtpbmRleF1cbiAgICAgICAgICAgIGxldCBpc0RpYWcgPSBmYWxzZVxuICAgICAgICAgICAgaWYgKHN0ZXBbMF0gIT0gMCAmJiBzdGVwWzFdICE9IDApIHtcbiAgICAgICAgICAgICAgICBpc0RpYWcgPSB0cnVlICAvL+S7o+ihqOaWnOedgOeahOaWueWQkVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHIgPSB0aGlzLl9jZWxsU2l6ZVxuICAgICAgICAgICAgbGV0IHggPSBub2RlLnggKyAoc3RlcFswXSAqIHIpXG4gICAgICAgICAgICBsZXQgeSA9IG5vZGUueSArIChzdGVwWzFdICogcilcbiAgICAgICAgICAgIC8vIOWdkOagh+i2iueVjOWIpOaWrVxuICAgICAgICAgICAgY29uc29sZS5sb2coeCwgeSlcbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh4KSA+ICh0aGlzLl9iZy53aWR0aCAvIDIgLSAzMCkgfHwgTWF0aC5hYnMoeSkgPiAzMDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy/nm5HmtYvmmK/lkKbmmK/norDmkp7nmoRcbiAgICAgICAgICAgIGlmICh0aGlzLnRlc3RPdmVybGF5KHgsIHkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5pac552A5Z2X54m55q6K5oOF5Ya177yM5piv5LiN5piv56Kw5pKe55qE77yM54m55q6K5aSE55CG5LiK5LiL5bem5Y+z5pyJ6Zqc56KN54mp5LiN6IO95pac552A6LWwXG4gICAgICAgICAgICBpZiAoaXNEaWFnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHkxID0geSArICgtMzApXG4gICAgICAgICAgICAgICAgbGV0IHkyID0geSArIDMwXG4gICAgICAgICAgICAgICAgbGV0IHgxID0geCsgKC0zMClcbiAgICAgICAgICAgICAgICBsZXQgeDIgPSB4KyAzMFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRlc3RPdmVybGF5KHgsIHkxKXx8dGhpcy50ZXN0T3ZlcmxheSh4LHkyKXx8dGhpcy50ZXN0T3ZlcmxheSh4MSx5KXx8dGhpcy50ZXN0T3ZlcmxheSh4Mix5KSkgey8v6L+Z5Liq54K55o6S6Zmk5o6JXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL+WIpOaWreaYr+WQpuWcqOW3suiuv+mXruiKgueCuVxuICAgICAgICAgICAgaWYgKHRoaXMuZmluZE5vZGUodGhpcy52aXNpdGVkTGlzdCwgeCwgeSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbm5vZGUgPSBuZXcgQVN0YXJOb2RlKHgsIHkpXG4gICAgICAgICAgICBubm9kZS5pc0RpYWcgPSBpc0RpYWdcbiAgICAgICAgICAgIHJlc3VsdExpc3QucHVzaChubm9kZSlcbiAgICAgICAgICAgIC8vdGhpcy5idWlsZFJlYWR5Tm9kZShubm9kZS54LG5ub2RlLnkpXG4gICAgICAgICAgICAvL+WIpOaWreaYr+S4jeaYr+eisOaSnuWIsOe7iOeCuS3kuI3lnKjov5nph4xcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0TGlzdFxuICAgIH1cblxuICAgIC8v5pCc57Si5qC45b+D6YC76L6RXG4gICAgcHJpdmF0ZSBhU3RhclNlYXJjaCgpOiBBU3Rhck5vZGUge1xuICAgICAgICBsZXQgaGF2ZUVuZE5vZGUgPSBudWxsXG4gICAgICAgIHRoaXMucmVhZHlMaXN0LnB1c2godGhpcy5fc3RhcnROb2RlKVxuICAgICAgICB3aGlsZSAodGhpcy5yZWFkeUxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbWluTm9kZSA9IHRoaXMuZ2V0TWluTm9kZSh0aGlzLnJlYWR5TGlzdCk7XG4gICAgICAgICAgICB0aGlzLnJlYWR5TGlzdCA9IHRoaXMucmVtb3ZlTGlzdE5vZGUodGhpcy5yZWFkeUxpc3QsIG1pbk5vZGUpXG4gICAgICAgICAgICB0aGlzLnZpc2l0ZWRMaXN0LnB1c2gobWluTm9kZSlcbiAgICAgICAgICAgIGxldCBsaXN0ID0gdGhpcy5maW5kTmVpZ2hib3VyKG1pbk5vZGUpOyAgLy/mib7nm7jpgrvoioLngrlcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIGxldCBuZWlnaGJvdXJOb2RlID0gbGlzdFtpbmRleF07XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0Tm9kZShtaW5Ob2RlLCBuZWlnaGJvdXJOb2RlKVxuICAgICAgICAgICAgICAgIGxldCB0bXBOb2RlID0gdGhpcy5maW5kTm9kZSh0aGlzLnJlYWR5TGlzdCwgbmVpZ2hib3VyTm9kZS54LCBuZWlnaGJvdXJOb2RlLnkpO1xuICAgICAgICAgICAgICAgIGlmICh0bXBOb2RlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWFkeUxpc3QucHVzaChuZWlnaGJvdXJOb2RlKVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmVpZ2hib3VyTm9kZS5leHBlY3RlZFN0ZXBzIDwgdG1wTm9kZS5leHBlY3RlZFN0ZXBzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVhZHlMaXN0ID0gdGhpcy5yZW1vdmVMaXN0Tm9kZSh0aGlzLnJlYWR5TGlzdCwgdG1wTm9kZSlcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWFkeUxpc3QucHVzaChuZWlnaGJvdXJOb2RlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8v5Yik5pat5piv5ZCm56Kw5pKe5Yiw57uI54K5XG4gICAgICAgICAgICBoYXZlRW5kTm9kZSA9IHRoaXMuZmluZEVuZE5vZGVCeVJlYWRMaXN0KClcbiAgICAgICAgICAgIGlmIChoYXZlRW5kTm9kZSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGF2ZUVuZE5vZGVcbiAgICB9XG4gICAgcHJpdmF0ZSBmaW5kRW5kTm9kZUJ5UmVhZExpc3QoKSB7XG4gICAgICAgIGxldCBfZW5kUmVhZHlOb2RlID0gbnVsbFxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5yZWFkeUxpc3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5yZWFkeUxpc3RbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbkVuZE5vZGUobm9kZS54LCBub2RlLnkpKSB7XG4gICAgICAgICAgICAgICAgX2VuZFJlYWR5Tm9kZSA9IG5vZGVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfZW5kUmVhZHlOb2RlXG4gICAgfVxuXG4gICAgLy/liKTmlq3mmK/lkKbnorDmkp7liLDnu4jngrlcbiAgICBwcml2YXRlIGlzSW5FbmROb2RlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIGxldCBtaW5YID0gdGhpcy5fZW5kTm9kZS54IC0gKHRoaXMuX2NlbGxTaXplIC8gMik7ICAgIC8v5q2j5pa55b2i5qC85a2Q77yM5q+U6L6D566A5Y2VXG4gICAgICAgIGxldCBtYXhYID0gdGhpcy5fZW5kTm9kZS54ICsgKHRoaXMuX2NlbGxTaXplIC8gMik7XG4gICAgICAgIGxldCBtaW5ZID0gdGhpcy5fZW5kTm9kZS55IC0gKHRoaXMuX2NlbGxTaXplIC8gMik7XG4gICAgICAgIGxldCBtYXhZID0gdGhpcy5fZW5kTm9kZS55ICsgKHRoaXMuX2NlbGxTaXplIC8gMik7XG4gICAgICAgIGlmICh4IDw9IG1heFggJiYgeCA+PSBtaW5YICYmIHkgPD0gbWF4WSAmJiB5ID49IG1pblkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8v6K6h566X6IqC54K55ZKM5pyf5pyb5q2l5pWwIFxuICAgIHByaXZhdGUgaW5pdE5vZGUocGFyZW50OiBBU3Rhck5vZGUsIG5vZGU6IEFTdGFyTm9kZSkge1xuICAgICAgICBsZXQgY29zdCA9IG5vZGUuaXNEaWFnID8gdGhpcy5fZGlhZ0Nvc3QgOiB0aGlzLl9zdHJhaWdodENvc3RcblxuICAgICAgICBsZXQgdXNlZFN0ZXBzID0gY29zdFxuICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICB1c2VkU3RlcHMgPSBwYXJlbnQudXNlZFN0ZXBzICsgY29zdDtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudFxuICAgICAgICBub2RlLnVzZWRTdGVwcyA9IHVzZWRTdGVwc1xuICAgICAgICBub2RlLmRpc3RhbmNlID0gdGhpcy5kaWFnb25hbChub2RlKSAvL+iuoeeul+i3neemu1xuICAgICAgICBub2RlLmV4cGVjdGVkU3RlcHMgPSBub2RlLnVzZWRTdGVwcyArIG5vZGUuZGlzdGFuY2UgLy8g5pyf5pyb5q2l5pWwXG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbW92ZUxpc3ROb2RlKGxpc3ROb2RlOiBBcnJheTxBU3Rhck5vZGU+LCBkZWxOb2RlOiBBU3Rhck5vZGUpIHtcbiAgICAgICAgbGV0IGxpc3QgPSBbXVxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGlzdE5vZGUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbGlzdE5vZGVbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKG5vZGUueCAhPSBkZWxOb2RlLnggfHwgbm9kZS55ICE9IGRlbE5vZGUueSkge1xuICAgICAgICAgICAgICAgIGxpc3QucHVzaChub2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaXN0XG4gICAgfVxuXG4gICAgLy/orqHnrpfmnJ/mnJvmnIDlsI/nmoToioLngrlcbiAgICBwcml2YXRlIGdldE1pbk5vZGUobGlzdE5vZGU6IEFycmF5PEFTdGFyTm9kZT4pIHtcbiAgICAgICAgaWYgKCFsaXN0Tm9kZSB8fCBsaXN0Tm9kZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChsaXN0Tm9kZS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3ROb2RlWzBdXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1pbk5vZGUgPSBsaXN0Tm9kZVswXVxuICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGlzdE5vZGUubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbGlzdE5vZGVbaW5kZXhdO1xuICAgICAgICAgICAgaWYgKG5vZGUuZXhwZWN0ZWRTdGVwcyA8IG1pbk5vZGUuZXhwZWN0ZWRTdGVwcykge1xuICAgICAgICAgICAgICAgIG1pbk5vZGUgPSBub2RlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5Ob2RlXG4gICAgfVxuXG5cbiAgICAvL+eUqGNvY29z5YaF572u55qE5Y6755uR5rWLXG4gICAgcHJpdmF0ZSB0ZXN0T3ZlcmxheSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICAvLyBsZXQgdiA9IG5ldyBjYy5WZWMyKHgsIHkpXG4gICAgICAgIGxldCByZWN0ID0gbmV3IGNjLlJlY3QoKHggLSAzMCAqIDAuNSksICh5IC0gMzAgKiAwLjUpLCAzMCwgMzApXG4gICAgICAgIGxldCBpc0hpdCA9IGZhbHNlXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLl93YWxsLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuX3dhbGxbaW5kZXhdO1xuICAgICAgICAgICAgLy9pc0hpdCA9IG5vZGUuZ2V0Qm91bmRpbmdCb3goKS5jb250YWlucyh2KVxuICAgICAgICAgICAgaXNIaXQgPSBjYy5JbnRlcnNlY3Rpb24ucmVjdFJlY3QocmVjdCwgbm9kZS5nZXRCb3VuZGluZ0JveCgpKVxuICAgICAgICAgICAgLy9pc0hpdCA9IGNjLkludGVyc2VjdGlvbi5wb2ludEluUG9seWdvbih2LG5vZGUuZ2V0Q29tcG9uZW50KGNjLkJveENvbGxpZGVyKS53b3JsZC5wb2ludHMpXG4gICAgICAgICAgICBpZiAoaXNIaXQpIHtcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXNIaXRcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmROb2RlKGxpc3ROb2RlOiBBcnJheTxBU3Rhck5vZGU+LCB4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICBsZXQgaGF2ZU5vZGUgPSBudWxsXG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsaXN0Tm9kZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBsaXN0Tm9kZVtpbmRleF07XG4gICAgICAgICAgICBpZiAobm9kZS54ID09IHggJiYgbm9kZS55ID09IHkpIHtcbiAgICAgICAgICAgICAgICBoYXZlTm9kZSA9IG5vZGVcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXZlTm9kZVxuICAgIH1cblxuICAgIG9uTG9hZCgpIHtcbiAgICAgICAgLy9jYy5kaXJlY3Rvci5nZXRDb2xsaXNpb25NYW5hZ2VyKCkuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2JnID0gY2MuZmluZCgnQ2FudmFzL0JnJyk7XG4gICAgICAgIGxldCB3YWxsID0gY2MuZmluZChcIkNhbnZhcy93YWxsXCIpXG4gICAgICAgIHRoaXMuX3dhbGwgPSB3YWxsLmNoaWxkcmVuXG4gICAgICAgIC8v55uR5o6n54K55Ye7XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5NT1VTRV9ET1dOLCB0aGlzLmNsaWNrU2VhcmNoLmJpbmQodGhpcykpXG4gICAgfVxuXG4gICAgY2xpY2tTZWFyY2goZXZlbnQ6IGNjLkV2ZW50LkV2ZW50VG91Y2gpIHtcbiAgICAgICAgLy/muIXnqbrph43mnaVcbiAgICAgICAgdGhpcy5yZWFkeUxpc3QgPSBbXVxuICAgICAgICB0aGlzLnZpc2l0ZWRMaXN0ID0gW11cbiAgICAgICAgbGV0IHN0YXJ0Tm9kZSA9IGNjLmZpbmQoJ0NhbnZhcy9zdGFydC1ub2RlJylcbiAgICAgICAgdGhpcy5fc3RhcnROb2RlID0gbmV3IEFTdGFyTm9kZShzdGFydE5vZGUueCwgc3RhcnROb2RlLnkpXG4gICAgICAgIHRoaXMuX3N0YXJ0Tm9kZS5zdGFydE5vZGUgPSBzdGFydE5vZGVcbiAgICAgICAgLy/ovazmjaLmiJDlsYDpg6jlnZDmoIdcbiAgICAgICAgbGV0IHAgPSB0aGlzLm5vZGUuY29udmVydFRvTm9kZVNwYWNlQVIoZXZlbnQuZ2V0TG9jYXRpb24oKSlcbiAgICAgICAgdGhpcy5fZW5kTm9kZSA9IG5ldyBBU3Rhck5vZGUocC54LCBwLnkpXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy50ZXN0T3ZlcmxheShwLngscC55KSlcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLmFTdGFyU2VhcmNoKClcbiAgICAgICAgaWYgKG5vZGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ+e7iOeCueS4jeWPr+i+vicpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICAvL+W8gOWni+enu+WKqOaWueWdl1xuICAgICAgICAvL+aehOW7uuWKqOS9nOaVsOe7hFxuICAgICAgICBsZXQgYWN0aW9uQXJyID0gW11cbiAgICAgICAgYWN0aW9uQXJyLnB1c2goY2MubW92ZVRvKDAuNSwgbmV3IGNjLlZlYzIobm9kZS54LCBub2RlLnkpKSlcbiAgICAgICAgd2hpbGUgKG5vZGUucGFyZW50ICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCB0bXAgPSBub2RlLnBhcmVudFxuICAgICAgICAgICAgYWN0aW9uQXJyLnB1c2goY2MubW92ZVRvKDAuNSwgbmV3IGNjLlZlYzIodG1wLngsIHRtcC55KSkpXG4gICAgICAgICAgICBub2RlID0gdG1wXG4gICAgICAgIH1cbiAgICAgICAgYWN0aW9uQXJyLnJldmVyc2UoKVxuICAgICAgICB0aGlzLl9zdGFydE5vZGUuc3RhcnROb2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShhY3Rpb25BcnIpKVxuICAgIH1cbiAgICAvL+aehOW7unJlYWR56IqC54K55L2N572uXG4gICAgcHJpdmF0ZSBidWlsZFJlYWR5Tm9kZSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgICAgY2MubG9hZGVyLmxvYWRSZXMoXCJwZXJmYWIvcmVhZHktbm9kZVwiLCBmdW5jdGlvbiAoZXJyLCBwcmVmYWIpIHtcbiAgICAgICAgICAgIGxldCBuZXdOb2RlID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgICAgIG5ld05vZGUueCA9IHhcbiAgICAgICAgICAgIG5ld05vZGUueSA9IHlcbiAgICAgICAgICAgIHNlbGYubm9kZS5hZGRDaGlsZChuZXdOb2RlKVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHN0YXJ0KCkge1xuXG4gICAgLy8gfVxuXG4gICAgLy/mm7zlk4jpob/nrpfms5VcbiAgICBwcml2YXRlIG1hbmhhdHRhbihub2RlOiBBU3Rhck5vZGUpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKG5vZGUueCAtIHRoaXMuX2VuZE5vZGUueCkgKiB0aGlzLl9zdHJhaWdodENvc3QgKyBNYXRoLmFicyhub2RlLnkgKyB0aGlzLl9lbmROb2RlLnkpICogdGhpcy5fc3RyYWlnaHRDb3N0O1xuICAgIH1cblxuICAgIHByaXZhdGUgZXVjbGlkaWFuKG5vZGU6IEFTdGFyTm9kZSkge1xuICAgICAgICB2YXIgZHggPSBub2RlLnggLSB0aGlzLl9lbmROb2RlLng7XG4gICAgICAgIHZhciBkeSA9IG5vZGUueSAtIHRoaXMuX2VuZE5vZGUueTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSkgKiB0aGlzLl9zdHJhaWdodENvc3Q7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBkaWFnb25hbChub2RlOiBBU3Rhck5vZGUpIHtcbiAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMobm9kZS54IC0gdGhpcy5fZW5kTm9kZS54KTtcbiAgICAgICAgdmFyIGR5ID0gTWF0aC5hYnMobm9kZS55IC0gdGhpcy5fZW5kTm9kZS55KTtcbiAgICAgICAgdmFyIGRpYWcgPSBNYXRoLm1pbihkeCwgZHkpO1xuICAgICAgICB2YXIgc3RyYWlnaHQgPSBkeCArIGR5O1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlhZ0Nvc3QgKiBkaWFnICsgdGhpcy5fc3RyYWlnaHRDb3N0ICogKHN0cmFpZ2h0IC0gMiAqIGRpYWcpO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9XG59XG4iXX0=