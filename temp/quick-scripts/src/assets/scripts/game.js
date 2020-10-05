"use strict";
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