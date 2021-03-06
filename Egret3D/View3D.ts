﻿module egret3d {

    /**
     * @class egret3d.View3D
     * @classdesc
     * 渲染视图。</p>
     * view3D 是整个3D引擎的渲染视口，可以控制渲染窗口的大小，渲染的方式。</p>
     * 可以设置不同的相机 Camera3D。</p>
     * 交换不同的场景元素 Scene3D 。</p>
     * 当前的View3D中会有一个Scene3D的节点和一个Camera3D来进行场景中的渲染。
     * 整个渲染的主循环通过 update  。</p>
     * Engre3DCanvas 中的View3D列表会主动调用View3D的update,加入了Engre3DCanvas中的View3D列表后不需要使用者update
     * @includeExample View3D.ts
     * @see egret3d.Camera3D
     * @see egret3d.Scene3D
     * @see egret3d.Egret3DCanvas
     * @version Egret 3.0
     * @platform Web,Native
     */
    export class View3D {
        static _contex3DProxy: Context3DProxy = new Context3DProxy();

        protected _viewPort: Rectangle = new Rectangle();
        protected _camera: Camera3D;
        protected _scene: Scene3D = new Scene3D();
        protected _render: RenderBase;

        protected _scissorRect: Rectangle = new Rectangle();
        protected _viewMatrix: Matrix4_4 = new Matrix4_4();

        protected _entityCollect: EntityCollect;
        protected _backColor: Vector3D = new Vector3D(0.3, 0.3, 0.6, 1.0);

        protected _cleanParmerts: number = Context3DProxy.gl.COLOR_BUFFER_BIT | Context3DProxy.gl.DEPTH_BUFFER_BIT; 
        private _sizeDiry: boolean = false;

        protected _renderTarget: RenderTargetTexture = new RenderTargetTexture();

        protected _huds: Array<HUD> = new Array<HUD>();

        //protected _testCamera: Camera3D = new Camera3D();

        public get renderTarget(): RenderTargetTexture {
            return this._renderTarget;
        }

        /**
        * @language zh_CN
        * 构建一个view3d对象
        * @param x 视口的屏幕x坐标
        * @param y 视口的屏幕y坐标
        * @param width 视口的屏幕宽度
        * @param height 视口的屏幕高度
        * @param camera 摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        constructor(x: number, y: number, width: number, height: number, camera: Camera3D = null) {
            this._entityCollect = new EntityCollect();
            this._entityCollect.root = this._scene;
            this._render = new DefaultRender();
            this._camera = camera || new Camera3D(CameraType.perspective);

            this._viewPort.x = x;
            this._viewPort.y = y;
            this._viewPort.width = width;
            this._viewPort.height = height;
            this._camera.aspectRatio = this._viewPort.width / this._viewPort.height;

            this._renderTarget.width = 512;
            this._renderTarget.height = 512;
            this._renderTarget.upload(View3D._contex3DProxy);

            //this._testCamera.lookAt(new Vector3D(0, 500, -500), new Vector3D(0, 0, 0));
            //this._testCamera.name = "testCamera";

        }

        public blender(cleanColor:boolean, cleanDepth:boolean) {
            this._cleanParmerts = (cleanColor ? Context3DProxy.gl.COLOR_BUFFER_BIT : 0) | (cleanDepth ? Context3DProxy.gl.DEPTH_BUFFER_BIT : 0);
        }

                
        /**
        * @language zh_CN
        * 设置view3d背景颜色
        * @param value  颜色值 a r g b
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set backColor(value: number) {
            this._backColor.w = (value >> 24 & 0xff) / 255;
            this._backColor.x = (value >> 16 & 0xff) / 255;
            this._backColor.y = (value >> 8 & 0xff) / 255;
            this._backColor.z = (value & 0xff) / 255;
        }
                        
        /**
        * @language zh_CN
        * 获取view3d背景颜色
        * @returns number 颜色值 a r g b
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get backColor(): number {
            return (this._backColor.w * 255 << 24) | (this._backColor.x * 255 << 16) | (this._backColor.y * 255 << 8) | (this._backColor.z * 255);
        }

        /**
        * @language zh_CN
        * 获取View3d中的渲染摄像机
        * @returns Camera3D 当前View3D的摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get camera3D(): Camera3D {
            return this._camera;
        }
        
        /**
        * @language zh_CN
        * 设置View3d中的渲染摄像机
        * @param value 当前View3D的摄像机
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set camera3D(value: Camera3D) {
            this._camera = value;
        }
        
        /**
        * @language zh_CN
        * 获取View3d中的场景对象
        * @returns Scene3D 场景对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get scene(): Scene3D {
            return this._scene;
        }
                
        /**
        * @language zh_CN
        * 设置View3d中的场景对象
        * @param sc 当前View3D的场景对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set scene(sc: Scene3D) {
            this._scene = sc;
        }
                
        /**
        * @language zh_CN
        * 设置当前视口的屏幕x坐标
        * @param x 视口的屏幕x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set x(value: number) {
            this._viewPort.x = value;
        }
                
                
        /**
        * @language zh_CN
        * 获得当前视口的屏幕x坐标
        * @returns number 视口的屏幕x坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get x(): number {
            return this._viewPort.x;
        }
                
        /**
        * @language zh_CN
        * 设置当前视口的屏幕y坐标
        * @param y 视口的屏幕y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set y(value: number) {
            this._viewPort.y = value;
        }
                
                
        /**
        * @language zh_CN
        * 获得当前视口的屏幕y坐标
        * @returns number 视口的屏幕y坐标
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get y(): number {
            return this._viewPort.y;
        }
                
        /**
        * @language zh_CN
        * 设置视口的屏幕宽度
        * @param width 视口的屏幕宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set width(value: number) {
            this._viewPort.width = value;
            this._camera.aspectRatio = this._viewPort.width / this._viewPort.height;
        }
                
        /**
        * @language zh_CN
        * 获取视口的屏幕宽度
        * @returns number 视口的屏幕宽度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get width(): number {
            return this._viewPort.width;
        }
                
        /**
        * @language zh_CN
        * 设置视口的屏幕高度
        * @param width 视口的屏幕高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public set height(value: number) {
            this._viewPort.height = value;
            this._camera.aspectRatio = this._viewPort.width / this._viewPort.height;
        }
                
        /**
        * @language zh_CN
        * 获取视口的屏幕高度
        * @returns number 视口的屏幕高度
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get height(): number {
            return this._viewPort.height;
        }

        /**
        * @language zh_CN
        * 获取视口数据 x y width height
        * @returns Rectangle 视口数据
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get viewPort(): Rectangle {
            return this._viewPort;
        }
                        
        /**
        * @private
        * @language zh_CN
        * 获取View3D的数据收集对象
        * @returns EntityCollect 数据收集对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public get entityCollect(): EntityCollect {
            return this._entityCollect;
        }
        
                        
        /**
        * @language zh_CN
        * 添加一个Object3D对象进场景根节点
        * @param child3d Object3D需要添加的对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public addChild3D(child3d: Object3D) {
            this._scene.addChild3D(child3d);
        }
                
        /**
        * @language zh_CN
        * 从场景根节点中移除一个Object3D对象
        * @param child3d 需要移除的Object3D对象
        * @version Egret 3.0
        * @platform Web,Native
        */
        public removeChild3D(child3d: Object3D) {
            this._scene.removeChild3D(child3d);
        }
        
        /**
        * @language zh_CN
        * 检测x y 是否在当前视口内
        * @param x  x 坐标。 
        * @param y  y 坐标。 
        */
        public inView3D(x: number, y: number) {
            return this._viewPort.inner(x, y);
        }

        /**
        * @language zh_CN
        * 添加 HUD 到渲染列表中
        * @param hud 需要增加的HUD
        * @version Egret 3.0
        * @platform Web,Native
        */
        public addHUD(hud: HUD) {
            if (this._huds.indexOf(hud) == -1) {
                hud.viewPort = this._viewPort;
                this._huds.push(hud);
            }
        }

        /**
        * @language zh_CN
        * 在渲染列表中删除一个HUD
        * @param hud 需要删除的HUD
        * @version Egret 3.0
        * @platform Web,Native
        */
        public delHUD(hud: HUD) {
            var index: number = this._huds.indexOf(hud);
            if (index >= 0 && index < this._huds.length) {
                this._huds.splice(index, 1);
            }
        }

        /**
        * @private
        * @language zh_CN
        * @version Egret 3.0
        * @platform Web,Native
        */
        public update(time: number, delay: number) {
            this._camera.viewPort = this._viewPort ;
            this._entityCollect.update(this._camera);

            this._render.update(time, delay, this._entityCollect, this._camera);

            //if (this._renderTarget) {
            //    View3D._contex3DProxy.setRenderToTexture(this._renderTarget.texture2D, true, 0);
            //    this._render.draw(time, delay, View3D._contex3DProxy, this._entityCollect, this._testCamera);
            //    View3D._contex3DProxy.setRenderToBackBuffer();
            //}

            View3D._contex3DProxy.viewPort(this._viewPort.x, this._viewPort.y, this._viewPort.width, this._viewPort.height);
            View3D._contex3DProxy.setScissorRectangle(this._viewPort.x, this._viewPort.y, this._viewPort.width, this._viewPort.height);

            if (this._cleanParmerts & Context3DProxy.gl.COLOR_BUFFER_BIT) {
                View3D._contex3DProxy.clearColor(this._backColor.x, this._backColor.y, this._backColor.z, this._backColor.w);
            }
            View3D._contex3DProxy.clear(this._cleanParmerts);
            this._render.draw(time, delay, View3D._contex3DProxy, this._entityCollect, this._camera);

            for (var i: number = 0; i < this._huds.length; ++i) {
                this._huds[i].draw(View3D._contex3DProxy);
            }
        }


        /**
        * @language zh_CN
        * 请求全屏
        */
        public static requestFullScreen() {
            var dom: HTMLElement = document.documentElement;
            if (dom.requestFullscreen) {
                dom.requestFullscreen();
            } else if (dom.webkitRequestFullScreen) {
                dom.webkitRequestFullScreen();
            }
        }

        /**
        * @language zh_CN
        * 退出全屏
        */
        public static exitFullscreen() {
            var de: Document = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        }
    }
}