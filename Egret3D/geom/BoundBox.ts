﻿module egret3d {
    /**
     * @language zh_CN
     * @class egret3d.Bound
     * @classdesc
     * 可使用 Bound 类 取得包围盒的数据。</p>
     * 包含包围盒的各顶点信息，当包围盒要进行世界变换时，应当变换各顶点信息。</p>
     * @see egret3d.Bound
     * @version Egret 3.0
     * @platform Web,Native
     */
    export class BoundBox extends Bound {
        
        /**
        * @language zh_CN
        * 盒子最小点
        */
        public min: Vector3D = new Vector3D();
                
        /**
        * @language zh_CN
        * 盒子最大点
        */
        public max: Vector3D = new Vector3D();
             
        /**
        * @language zh_CN
        * 盒子宽
        */
        public width: number = 0;
                                
        /**
        * @language zh_CN
        * 盒子高
        */
        public heigth: number = 0;

        /**
        * @language zh_CN
        * 盒子长
        */
        public depth: number = 0;

        /**
        * @language zh_CN
        * 盒子体积
        */
        public volume: number = 0;
        
        /**
        * @language zh_CN
        * 盒子包围球中心点
        */
        public center: Vector3D = new Vector3D();
                
        /**
        * @language zh_CN
        * 盒子包围球半径
        */
        public radius: number = 0;

        /**
        * @language zh_CN
        * constructor
        * @param min
        * @param max
        */
        constructor(owner:Object3D = null, min: Vector3D = new Vector3D(), max: Vector3D = new Vector3D()) {
            super(owner);
            this.min.copyFrom(min);
            this.max.copyFrom(max);
            this.calculateBox();
        }
        
        /**
        * @language zh_CN
        * 拷贝一个包围盒
        * @param box 
        */
        public copyFrom(box: BoundBox) {
            this.min.copyFrom(box.min);
            this.max.copyFrom(box.max);
            this.calculateBox();
        }
                
        /**
        * @language zh_CN
        * 填充当前包围盒
        * @param box 
        */
        public fillBox(min: Vector3D, max: Vector3D) {
            this.min.copyFrom(min);
            this.max.copyFrom(max);
            this.calculateBox();
        }
                
        /**
        * @language zh_CN
        * 检测一个点是否包围盒内
        * @param pos 检测的点
        * @returns 成功返回true
        */
        public pointIntersect(pos: Vector3D): boolean {
            if (pos.x <= this.max.x && pos.x >= this.min.x &&
                pos.y <= this.max.y && pos.y >= this.min.y &&
                pos.z <= this.max.z && pos.z >= this.min.z) {
                return true;
            }
            return false;
        }
                        
        /**
        * @language zh_CN
        * 检测两个包围盒是否相交
        * @param box2 其中一个包围盒 
        * @param boxIntersect 相交的包围盒 默认为空
        * @returns 成功返回true
        */
        public intersectAABBs(box2: BoundBox, boxIntersect: BoundBox = null): boolean {
            if (this.min.x > box2.max.x) {
                return false;
            }

            if (this.max.x < box2.min.x) {
                return false;
            }

            if (this.min.y > box2.max.y) {
                return false;
            }

            if (this.max.y < box2.min.y) {
                return false;
            }

            if (this.min.z > box2.max.z) {
                return false;
            }

            if (this.max.z < box2.min.z) {
                return false;
            }

            if (boxIntersect != null) {
                boxIntersect.min.x = Math.max(this.min.x, box2.min.x);
                boxIntersect.max.x = Math.min(this.max.x, box2.max.x);
                boxIntersect.min.y = Math.max(this.min.y, box2.min.y);
                boxIntersect.max.y = Math.min(this.max.y, box2.max.y);
                boxIntersect.min.z = Math.max(this.min.z, box2.min.z);
                boxIntersect.max.z = Math.min(this.max.z, box2.max.z);
                boxIntersect.calculateBox();
            }
            return true;
        }
               

        /**
        * @language zh_CN
        * 检测两个包围对象是否相交
        * @param 检测的目标
        * @param 相交的结果 可以为null
        * @returns  成功返回true
        */
        public intersect(target: Bound, intersect: Bound = null): boolean {
            return this.intersectAABBs(<BoundBox>target, <BoundBox>intersect);
        }
                                                                
        /**
        * @language zh_CN
        * 以字符串形式返回box的值
        * @returns 字符串
        */
        public toString(): string {
            return "BoundBox [min:(" + this.min.x + ", " + this.min.y + ", " + this.min.z + ") max:(" + this.max.x + ", " + this.max.y + ", " + this.max.z + ")]";
        }
                                        
        /**
        * @language zh_CN
        * 计算包围盒数据
        */
        public calculateBox() {
            this.vexData.length = 0;
            this.indexData.length = 0;

            var sub: Vector3D = this.max.subtract(this.min);

            this.vexData.push(this.min.x);
            this.vexData.push(this.min.y);
            this.vexData.push(this.min.z);

            this.vexData.push(this.min.x);
            this.vexData.push(this.min.y);
            this.vexData.push(this.min.z + sub.z);

            this.vexData.push(this.min.x + sub.x);
            this.vexData.push(this.min.y);
            this.vexData.push(this.min.z + sub.z);

            this.vexData.push(this.min.x + sub.x);
            this.vexData.push(this.min.y);
            this.vexData.push(this.min.z);

            this.vexData.push(this.max.x - sub.x);
            this.vexData.push(this.max.y);
            this.vexData.push(this.max.z - sub.z);


            this.vexData.push(this.max.x - sub.x);
            this.vexData.push(this.max.y);
            this.vexData.push(this.max.z);

            this.vexData.push(this.max.x);
            this.vexData.push(this.max.y);
            this.vexData.push(this.max.z);

            this.vexData.push(this.max.x);
            this.vexData.push(this.max.y);
            this.vexData.push(this.max.z - sub.z);

            this.indexData.push(
                0, 4, 7, 0, 7, 3,
                2, 6, 5, 2, 5, 1,
                4, 5, 6, 4, 6, 7,
                0, 3, 2, 0, 2, 1,
                0, 1, 5, 0, 5, 4,
                3, 7, 6, 3, 6, 2
            );

            this.width = this.max.x - this.min.x;
            this.heigth = this.max.y - this.min.y;
            this.depth = this.max.z - this.min.z;
            this.volume = this.width * this.heigth * this.depth;

            var c: Vector3D = this.max.subtract(this.min);
            c.scaleBy(0.5);

            this.radius = c.length;
            this.center.copyFrom(this.min);
            var tmp: Vector3D = this.center.add(c);
            this.center.copyFrom(tmp);
        }

        /**
        * @language zh_CN
        * 检测一个盒子是否在视椎体内
        * @param frustum 视椎体
        * @returns 在视椎内返回ture
        * @version Egret 3.0
        * @platform Web,Native
        */
        public inBound(frustum: Frustum): boolean {
            return frustum.inBox(this);
        }

        protected updateAABB() {
            this.min.copyFrom(new Vector3D(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE));
            this.max.copyFrom(new Vector3D(Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE));
            for (var i: number = 0; i < this.vexData.length; i += this.vexLength) {
                if (this.max.x < this.vexData[i]) {
                    this.max.x = this.vexData[i];
                }
                if (this.max.y < this.vexData[i + 1]) {
                    this.max.y = this.vexData[i + 1];
                }
                if (this.max.z < this.vexData[i + 2]) {
                    this.max.z = this.vexData[i + 2];
                }
               
                if (this.min.x > this.vexData[i]) {
                    this.min.x = this.vexData[i];
                }
                if (this.min.y > this.vexData[i + 1]) {
                    this.min.y = this.vexData[i + 1];
                }
                if (this.min.z > this.vexData[i + 2]) {
                    this.min.z = this.vexData[i + 2];
                }
            }
        }
    }
}