// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//定义数据类型
class AStarNode {
    /** 行坐标 **/
    x: number
    /** 列坐标 **/
    y: number
    /** 已使用步数 ：从开始节点到当前节点已使用的步数 **/
    usedSteps: number = 0
    /** 预估距离 ：当前节点到目标节点无视障碍的距离 **/
    distance: number
    /** 期望步数 = 已使用步数+无障碍距离 **/
    expectedSteps: number
    /** 父节点：打印路径时需要 **/
    parent: AStarNode
    //代表斜角度
    isDiag: boolean = false

    startNode: cc.Node

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    private _startNode: AStarNode;
    private _endNode: AStarNode  // 目标点
    private _straightCost: number = 1.0;     //上下左右走的代价
    private _diagCost: number = Math.SQRT2;  //斜着走的代价 
    private _cellSize: number = 30
    private _bg: cc.Node
    private _wall: Array<cc.Node> //墙的节点
    //定义八方向 [x y]
    private stepArray: Array<Array<number>> = [[0, -1], [0, 1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]]
    // LIFE-CYCLE CALLBACKS:
    //待访问节点
    private readyList: Array<AStarNode> = []
    private visitedList: Array<AStarNode> = []
    //找邻居节点
    private findNeighbour(node: AStarNode) {
        //初始化node
        let resultList = []
        // 获取8个节点的坐标并判断有效性
        for (let index = 0; index < 8; index++) {
            let step = this.stepArray[index]
            let isDiag = false
            if (step[0] != 0 && step[1] != 0) {
                isDiag = true  //代表斜着的方向
            }
            let r = this._cellSize
            let x = node.x + (step[0] * r)
            let y = node.y + (step[1] * r)
            // 坐标越界判断
            console.log(x, y)
            if (Math.abs(x) > (this._bg.width / 2 - 30) || Math.abs(y) > 300) {
                continue
            }
            //监测是否是碰撞的
            if (this.testOverlay(x, y)) {
                continue
            }
            //斜着块特殊情况，是不是碰撞的，特殊处理上下左右有障碍物不能斜着走
            if (isDiag) {
                let y1 = y + (-30)
                let y2 = y + 30
                let x1 = x+ (-30)
                let x2 = x+ 30
                if (this.testOverlay(x, y1)||this.testOverlay(x,y2)||this.testOverlay(x1,y)||this.testOverlay(x2,y)) {//这个点排除掉
                    continue
                }
            }

            //判断是否在已访问节点
            if (this.findNode(this.visitedList, x, y) != null) {
                continue
            }
            let nnode = new AStarNode(x, y)
            nnode.isDiag = isDiag
            resultList.push(nnode)
            //this.buildReadyNode(nnode.x,nnode.y)
            //判断是不是碰撞到终点-不在这里
        }
        return resultList
    }

    //搜索核心逻辑
    private aStarSearch(): AStarNode {
        let haveEndNode = null
        this.readyList.push(this._startNode)
        while (this.readyList.length > 0) {
            const minNode = this.getMinNode(this.readyList);
            this.readyList = this.removeListNode(this.readyList, minNode)
            this.visitedList.push(minNode)
            let list = this.findNeighbour(minNode);  //找相邻节点
            for (let index = 0; index < list.length; index++) {
                let neighbourNode = list[index];
                this.initNode(minNode, neighbourNode)
                let tmpNode = this.findNode(this.readyList, neighbourNode.x, neighbourNode.y);
                if (tmpNode == null) {
                    this.readyList.push(neighbourNode)
                } else if (neighbourNode.expectedSteps < tmpNode.expectedSteps) {
                    this.readyList = this.removeListNode(this.readyList, tmpNode)
                    this.readyList.push(neighbourNode)
                }
            }
            //判断是否碰撞到终点
            haveEndNode = this.findEndNodeByReadList()
            if (haveEndNode != null) {
                break
            }
        }
        return haveEndNode
    }
    private findEndNodeByReadList() {
        let _endReadyNode = null
        for (let index = 0; index < this.readyList.length; index++) {
            const node = this.readyList[index];
            if (this.isInEndNode(node.x, node.y)) {
                _endReadyNode = node
                break
            }
        }
        return _endReadyNode
    }

    //判断是否碰撞到终点
    private isInEndNode(x: number, y: number) {
        let minX = this._endNode.x - (this._cellSize / 2);    //正方形格子，比较简单
        let maxX = this._endNode.x + (this._cellSize / 2);
        let minY = this._endNode.y - (this._cellSize / 2);
        let maxY = this._endNode.y + (this._cellSize / 2);
        if (x <= maxX && x >= minX && y <= maxY && y >= minY) {
            return true
        } else {
            return false
        }
    }

    //计算节点和期望步数 
    private initNode(parent: AStarNode, node: AStarNode) {
        let cost = node.isDiag ? this._diagCost : this._straightCost

        let usedSteps = cost
        if (parent) {
            usedSteps = parent.usedSteps + cost;
        }
        node.parent = parent
        node.usedSteps = usedSteps
        node.distance = this.diagonal(node) //计算距离
        node.expectedSteps = node.usedSteps + node.distance // 期望步数

    }

    private removeListNode(listNode: Array<AStarNode>, delNode: AStarNode) {
        let list = []
        for (let index = 0; index < listNode.length; index++) {
            const node = listNode[index];
            if (node.x != delNode.x || node.y != delNode.y) {
                list.push(node)
            }
        }
        return list
    }

    //计算期望最小的节点
    private getMinNode(listNode: Array<AStarNode>) {
        if (!listNode || listNode.length == 0) {
            return null
        } else if (listNode.length == 1) {
            return listNode[0]
        }
        let minNode = listNode[0]
        for (let index = 0; index < listNode.length; index++) {
            const node = listNode[index];
            if (node.expectedSteps < minNode.expectedSteps) {
                minNode = node;
            }
        }
        return minNode
    }


    //用cocos内置的去监测
    private testOverlay(x: number, y: number) {
        // let v = new cc.Vec2(x, y)
        let rect = new cc.Rect((x - 30 * 0.5), (y - 30 * 0.5), 30, 30)
        let isHit = false
        for (let index = 0; index < this._wall.length; index++) {
            const node = this._wall[index];
            //isHit = node.getBoundingBox().contains(v)
            isHit = cc.Intersection.rectRect(rect, node.getBoundingBox())
            //isHit = cc.Intersection.pointInPolygon(v,node.getComponent(cc.BoxCollider).world.points)
            if (isHit) {
                break
            }


        }
        return isHit
    }

    private findNode(listNode: Array<AStarNode>, x: number, y: number) {
        let haveNode = null
        for (let index = 0; index < listNode.length; index++) {
            const node = listNode[index];
            if (node.x == x && node.y == y) {
                haveNode = node
                break
            }
        }
        return haveNode
    }

    onLoad() {
        //cc.director.getCollisionManager().enabled = true;
        this._bg = cc.find('Canvas/Bg');
        let wall = cc.find("Canvas/wall")
        this._wall = wall.children
        //监控点击
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.clickSearch.bind(this))
    }

    clickSearch(event: cc.Event.EventTouch) {
        //清空重来
        this.readyList = []
        this.visitedList = []
        let startNode = cc.find('Canvas/start-node')
        this._startNode = new AStarNode(startNode.x, startNode.y)
        this._startNode.startNode = startNode
        //转换成局部坐标
        let p = this.node.convertToNodeSpaceAR(event.getLocation())
        this._endNode = new AStarNode(p.x, p.y)
        //console.log(this.testOverlay(p.x,p.y))
        let node = this.aStarSearch()
        if (node == null) {
            console.log('终点不可达')
            return
        }
        //开始移动方块
        //构建动作数组
        let actionArr = []
        actionArr.push(cc.moveTo(0.5, new cc.Vec2(node.x, node.y)))
        while (node.parent != null) {
            let tmp = node.parent
            actionArr.push(cc.moveTo(0.5, new cc.Vec2(tmp.x, tmp.y)))
            node = tmp
        }
        actionArr.reverse()
        this._startNode.startNode.runAction(cc.sequence(actionArr))
    }
    //构建ready节点位置
    private buildReadyNode(x: number, y: number) {
        let self = this
        cc.loader.loadRes("perfab/ready-node", function (err, prefab) {
            let newNode = cc.instantiate(prefab);
            newNode.x = x
            newNode.y = y
            self.node.addChild(newNode)
        })
    }

    // start() {

    // }

    //曼哈顿算法
    private manhattan(node: AStarNode) {
        return Math.abs(node.x - this._endNode.x) * this._straightCost + Math.abs(node.y + this._endNode.y) * this._straightCost;
    }

    private euclidian(node: AStarNode) {
        var dx = node.x - this._endNode.x;
        var dy = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    }

    private diagonal(node: AStarNode) {
        var dx = Math.abs(node.x - this._endNode.x);
        var dy = Math.abs(node.y - this._endNode.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }

    // update (dt) {}
}
