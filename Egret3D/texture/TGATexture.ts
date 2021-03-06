﻿module egret3d {

    /**
     * @private 
     */
    export class TGATexture implements ITexture {

        public width: number;
        public height: number;
        public texture2D: Texture2D;
        public texture3D: Texture3D;

        public internalFormat: InternalFormat;
        public colorFormat: number;
        public mimapData: Array<MipmapData>;

        private _smooth: boolean = true;

        /**
        * @language zh_CN
        * 设置贴图是否使用 mipmap , mipmap为一个贴图的LOD层级贴图。例如（1024*1024的贴图，往下就会自动生成 512*512,256*256,128*128,64*64,32*32,16*16,8*8,4*4,2*2,1*1）
        * @param img HTMLImageElement（网页图像元素）
        */
        public set useMipmap(flag: boolean) {
            this.texture2D.useMipmap = flag;
        }

        /**
         * @language zh_CN
         * 获取贴图是否使用 mipmap , mipmap为一个贴图的LOD层级贴图。例如（1024*1024的贴图，往下就会自动生成 512*512,256*256,128*128,64*64,32*32,16*16,8*8,4*4,2*2,1*1）
         * @param img HTMLImageElement（网页图像元素）
         */
        public get useMipmap(): boolean {
            return this.texture2D.useMipmap;
        }

        /**
  * @language zh_CN
  * 设置贴图是否使用 smooth 
  * @param img HTMLImageElement（网页图像元素）
  */
        public set smooth(flag: boolean) {
            this._smooth = flag;
        }


        /**
         * @language zh_CN
         * 获取贴图是否使用 smooth
         * @param img HTMLImageElement（网页图像元素）
         */
        public get smooth(): boolean {
            return this._smooth;
        }

        public upload(context3D: Context3DProxy) {
            if (!this.texture2D) {
                this.texture2D.texture = context3D.creatTexture2D();

                this.texture2D.internalFormat = this.internalFormat;
                this.texture2D.colorFormat = this.colorFormat;
                this.texture2D.mimapData = this.mimapData;
                this.texture2D.smooth = this._smooth;
                this.useMipmap = true;   

                if (this.mimapData && this.mimapData.length > 0) {
                    for (var i: number = 0; i < this.mimapData.length; i++) {
                        context3D.upLoadTextureData(i, this.texture2D);
                    }
                }
                else {
                    context3D.upLoadTextureData(0, this.texture2D);
                }
            }
        }

        public uploadForcing(context3D: Context3DProxy) {
            context3D.upLoadTextureData(0, this.texture2D);
        }
    }
}