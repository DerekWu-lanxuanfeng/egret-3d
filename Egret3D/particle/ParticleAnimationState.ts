﻿module egret3d {
    
    /**
     * @language zh_CN
     * @class egret3d.ParticleAnimationState
     * @classdesc
     * 粒子动画状态机
     * @version Egret 3.0
     * @platform Web,Native
     */
    export class ParticleAnimationState implements IAnimationState {
                
        /**
        * @language zh_CN
        * 动画状态机名字
        * @version Egret 3.0
        * @platform Web,Native
        */
        public name: string;
                                                        
        /**
        * @language zh_CN
        * 动画效果节点列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        public animNodes: AnimationNode[];
                                                                
        /**
        * @language zh_CN
        * 动画关键帧列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        public keyFrames: AnimationCurve[];
                                        
        /**
        * @language zh_CN
        * 新增顶点个数总量
        * @version Egret 3.0
        * @platform Web,Native
        */
        public numberOfVertices: number = 0;
                                                
        /**
        * @language zh_CN
        * 新增顶点的长度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public vertexSizeInBytes: number = 0 ;
                        
        /**
        * @language zh_CN
        * 动画状态机顶点着色器文件名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        public vertex_shaders: string[];
                                
        /**
        * @language zh_CN
        * 动画状态机片段着色器文件名列表
        * @version Egret 3.0
        * @platform Web,Native
        */
        public fragment_shaders: string[];
                                                
        /**
        * @language zh_CN
        * 粒子总持续时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        public totalTime: number = 0;
                                                        
        /**
        * @language zh_CN
        * 最大空间
        * @version Egret 3.0
        * @platform Web,Native
        */
        public maxSpace: number = 0;
                                        
        /**
        * @language zh_CN
        * 最大粒子数量
        * @version Egret 3.0
        * @platform Web,Native
        */
        public maxParticles: number = 0;

                                        
        /**
        * @language zh_CN
        * 粒子速率
        * @version Egret 3.0
        * @platform Web,Native
        */
        public rate: number = 0;

                                        
        /**
        * @language zh_CN
        * 粒子是否循环 1.0是循环 0.0是不循环
        * @version Egret 3.0
        * @platform Web,Native
        */
        public loop: number = 1.0;  //0.0/1.0

        /**
        * @language zh_CN
        * 粒子持续时间
        * @version Egret 3.0
        * @platform Web,Native
        */
        public duration: number = 5.0;

        /**
        * @language zh_CN
        * 是否反转 1.0是反转 0.0是不反转
        * @version Egret 3.0
        * @platform Web,Native
        */
        public reverse: number = 1.0;//0.0/1.0
        
        /**
        * @language zh_CN
        * 跟随的目标
        * @version Egret 3.0
        * @platform Web,Native
        */
        public followTarget: Object3D = null;
                
        /**
        * @language zh_CN
        * 构造函数
        * @param name 粒子动画状态名
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(name: string) {
            this.name = name;

            this.animNodes = [];
            this.keyFrames = [];
            this.vertex_shaders = [];
            this.fragment_shaders = [];
        }

        /**
        * @language zh_CN
        * 添加动画功能节点
        * 添加继承 animNodeBase 功能节点 例如粒子的 加速度功能节点，匀速功能节点
        * @param node 节点对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public addNode(node: AnimationNode) {
            node.state = this ;
            this.animNodes.push(node);
        }

        /**
        * @language zh_CN
        * 移除动画功能节点
        * 删除指定的动画功能节点，但是不能动态删除，需要进行 功能重置
        * @param node 节点对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public removeNode(node: AnimationNode) {
            var index: number = this.animNodes.indexOf(node);
            if (index != -1)
                this.animNodes.splice(index, 1);
        }

         /**
        * @language zh_CN
        * 清空分配好的动画节点
        * @param node 节点对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public clean() {
            this.animNodes.length = 0; 
        }

        /**
        * @language zh_CN
        * 计算节点
        * @private 
        */
        public calculate(geometry: Geometry) {
            this.vertex_shaders.length = 0;
            this.fragment_shaders.length = 0;

            for (var i: number = 0; i < this.animNodes.length; i++) {

                if (this.animNodes[i].vertex_ShaderName != "")
                    this.vertex_shaders.push(this.animNodes[i].vertex_ShaderName);
                if (this.animNodes[i].frament_ShaderName!="")
                    this.fragment_shaders.push(this.animNodes[i].frament_ShaderName);

                var offsetIndex: number = geometry.vertexAttLength ; 
                for (var j: number = 0; j < this.animNodes[i].attributes.length; ++j) {
                    if (this.animNodes[i].attributes[j].size > 0) {
                        this.animNodes[i].attributes[j].offsetIndex = offsetIndex ; 
                        geometry.vertexAttLength += this.animNodes[i].attributes[j].size;
                        geometry.vertexSizeInBytes += this.animNodes[i].attributes[j].size * 4;
                        geometry.subGeometrys[0].preAttList.push(this.animNodes[i].attributes[j]);
                    }
                    offsetIndex = geometry.vertexAttLength;
                }
            }
        }
                
        /**
        * @language zh_CN
        * @private 
        */
        public fill(geometry: Geometry, maxParticle: number) {
            for (var i: number = 0; i < this.animNodes.length; i++) {
                this.animNodes[i].build(geometry, maxParticle);
            }
        }
        
        /**
        * @language zh_CN
        * @private 
        */
        public update(time: number, delay: number, geometry: Geometry,  context: Context3DProxy ) {
            for (var i: number = 0; i < this.animNodes.length; i++) {
                this.animNodes[i].update(time, delay,geometry,context);
            }
        }
    }
}