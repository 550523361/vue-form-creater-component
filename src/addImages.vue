<template>
        <div class="mainViewContainer">
            <div class="frameContainer">
                    <draggable
                               @start="drag=true"
                               @end="draggItemFun"
                               v-model="orderableImageList"
                               :options="{animation:1000}"
                    >
                        <transition-group tag="div" class="frameGroupContainer">
                            <div :class="{
                                          itemContainer:true,
                                          showItemClass:item.id==showItemId&&showItemId!=''
                                          }" v-if="item" :style="{
                                            background:'transparent'
                                          }"
                                        v-for="(item,seq) in orderableImageList"
                                       :key="'item'+seq" :groupIndex="seq">
                                <div class="imageContainer" :style="{background:'url('+(item.url)+') no-repeat center center',height:'120px',width:'100%'}"
                                     :groupIndex="seq">
                                    <span class="tipLabel" style="display: none"></span>
                                </div>
                                <div class="operateContainer" v-if="!config.readonly">
                                    <span @click="moveItem($event,orderableImageList,0,item,seq,'d',1)" style="width:20px;height:20px;border-radius: 50%;text-align: center;"></span>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
            </div>
            <div class="addBtnContainer" v-if="orderableImageList.length<config.maxNum&&!config.readonly" style="align-self:center;margin-left:0px;font-size: 14px;background: #e4e8f1;text-align: left;">
                <el-upload
                        class="upload-demo"
                        name="file"
                        multiple
                        :show-file-list="false"
                        action="/api-backend/fileUpload.json"
                        :on-change="onchangeUpload"
                        :before-upload="beforeIconUpload"
                        :on-success="saveAppSuccess">
                    <el-button size="small" type="primary">批量添加图片</el-button>
                    <div slot="tip" class="el-upload__tip">
                        ①尺寸要求:1280px*800px,
                        ②大小要求:500kb以内,
                        ③格式为jpg,jpeg,png
                        文件上传较大时，请耐心等待
                    </div>
                </el-upload>
            </div>
        </div>
</template>
<script>
    import draggable from 'vuedraggable'

    export default {
        components:{
            draggable
        },
        name: 'images',
        data(){
            return{
                drag:false,
                showItemId:0,
                config:{
                    readonly:false
                },
                orderableImageList:[],
            }
        },
        methods:{
            addItem(frame,seq,url){
                frame.push({
                    id:url,
                    name:'图片',
                    url:url||''
                })
                this.$set(this,"orderableImageList",JSON.parse(JSON.stringify(this.orderableImageList)))
                this.syncData()
            },
            moveItem(event,frame,index,item,seq,direction,moveType){
                event.preventDefault();
                event.stopPropagation();
                console.log(frame,index,item,seq,direction,moveType)
                if(direction == "v"){
                    let tempItem=frame.splice(seq,1)[0];
                    frame.splice(seq+moveType,0,tempItem);
                }else if(direction == "h"){
                    let targetFram=this.orderableImageList[index+moveType];
                    let tempItem=frame.splice(seq,1)[0];
                    targetFram.push(tempItem);
                }else if(direction == "d"){
                    frame.splice(seq,1);
                    if(frame.length==0&&this.orderableImageList.length>5){
                        this.orderableImageList.splice(index,1);
                    }
                }
                this.$set(this,"orderableImageList",JSON.parse(JSON.stringify(this.orderableImageList)))
                this.syncData();
            },
            draggItemFun(param){
                this.drag=false;
                this.syncData();
            },
            mouseout(item){
                this.showItemId=0;
            },
            mouseover(item){
                this.showItemId=item.id;
            },
            saveAppSuccess(response, file, fileList){
                // console.log(response,file,fileList)
                console.log(file)
                let url=response.data.fileUrls[0];
                this.addItem(this.orderableImageList,0,url);
                this.$nextTick(data=>{
                    this.loading&&this.loading.close&&this.loading.close();
                })
            },
            onchangeUpload(data){
                this.choosedAppIcon=data;
            },
            beforeIconUpload(file) {
                //console.log("beforeIconUpload",file)
                let that=this;
                return new Promise(function (resolve,reject) {
                    if(!(file.type=="image/png"||file.type=="image/jpg"||file.type=="image/jpeg"||file.type=="image/gif")){
                        that.$message.error('请选择.png/jpg/jpeg图片');
                        reject({msg:"please choose png image"});
                    }
                    if(that.choosedAppIcon!=null){
                        var reader = new FileReader();
                            reader.onload = function(event) {
                                let image=new Image();
                                    image.onload=data=>{
                                        //console.log("*******",data,file)
                                        let imageData=data.path&&data.path[0]||data.target;
                                        let imageWidth=imageData.width,imageHeight=imageData.height;
                                        if(that.config.imageConfig){
                                            let imageConfig=that.config.imageConfig;
                                            if(imageConfig.size){
                                                if(file.size>imageConfig.size){
                                                    that.$msgbox("上传图片过大 请不要超过 "+(imageConfig.size/1024/1024).toFixed(2)+" Mb");
                                                    reject({msg:"上传图片过大 请不要超过 "+imageConfig.size/1024/1024+" Mb"});
                                                    return;
                                                }
                                            }
                                            if(imageConfig.width){
                                                if(imageWidth!=imageConfig.width){
                                                    console.log(imageWidth,imageHeight)
                                                    that.$msgbox("图片宽度必须为"+imageConfig.width+"px");
                                                    reject({msg:"图片宽度必须为"+imageConfig.width+"px"});
                                                    return;
                                                }

                                            }
                                            if(imageConfig.height){
                                                if(imageHeight!=imageConfig.height){
                                                    that.$msgbox("图片高度必须为"+imageConfig.height+"px");
                                                    reject({msg:"图片高度必须为"+imageConfig.height+"px"});
                                                    return;
                                                }
                                            }
                                            that.loading = that.$loading({
                                                lock: true,
                                                text: 'Loading',
                                                spinner: 'el-icon-loading',
                                                background: 'rgba(0, 0, 0, 0.3)'
                                            });
                                            resolve({msg:"success"})
                                        }else{
                                            if(that.config.validatorHandler&&typeof that.config.validatorHandler == "function"){
                                                let result=that.config.validatorHandler(imageWidth,imageHeight,file)
                                                if(result instanceof Promise){
                                                    result.then(success=>{
                                                        that.loading = that.$loading({
                                                            lock: true,
                                                            text: 'Loading',
                                                            spinner: 'el-icon-loading',
                                                            background: 'rgba(0, 0, 0, 0.3)'
                                                        });
                                                        resolve({msg:"success"})
                                                    },error=>{
                                                        that.$msgbox(error.msg);
                                                        reject({msg:error.msg});
                                                    })
                                                }else{
                                                    if(result){
                                                        that.$msgbox(result.msg);
                                                        reject({msg:result.msg});
                                                    }else{
                                                        that.loading = that.$loading({
                                                            lock: true,
                                                            text: 'Loading',
                                                            spinner: 'el-icon-loading',
                                                            background: 'rgba(0, 0, 0, 0.3)'
                                                        });
                                                        resolve({msg:"success"})
                                                    }
                                                }
                                            }else{
                                                that.loading = that.$loading({
                                                    lock: true,
                                                    text: 'Loading',
                                                    spinner: 'el-icon-loading',
                                                    background: 'rgba(0, 0, 0, 0.3)'
                                                });
                                                resolve({msg:"success"})
                                            }
                                        }

                                    }
                                image.src = event.target.result;
                            }
                            reader.readAsDataURL(file);
                    }
                })

            },
            syncData(){
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,this.orderableImageList.map(item=>{
                            return item.url;
                        }));
                    }
                }
            },
            init(){
                let config=this.$attrs.config;
                this.config=config;
                let formData=config.data;
                if(formData){
                    let orderableImageList=JSON.parse(JSON.stringify(formData));
                    console.log("orderableImageList",orderableImageList)
                    orderableImageList=orderableImageList.map(item=>{
                        return {
                            url:item,
                            id:'file_Id_temp'+Math.ceil(Math.random()*1000),
                            name:'file_temp'+Math.ceil(Math.random()*1000)
                        }
                    })
                    this.orderableImageList=orderableImageList;
                    this.$set(this,"orderableImageList",JSON.parse(JSON.stringify(this.orderableImageList)))
                    if(this.config.dataBus){
                        if(typeof this.config.dataBus ==="function"){
                            this.syncData()
                        }
                    }
                }
            }
        },
        created() {
        },
        computed:{
        },
        mounted(){
            this.$watch("$attrs.config",function (newData,oldData) {
                //console.log("newData,oldData",newData)
                this.init();
            },{
                deep:true
            })
            this.init();

        }
    }
</script>

<style scoped>
    #container {
        height: 300px;
        width:800px;
    }
    .showItemClass{
        animation: colors 3s  infinite ;
        /*box-shadow: 1px 1px  10px #000,1px -1px  10px #000,-1px -1px  10px #000;*/
    }

    @keyframes colors {
        0%{
            background: #000!important;
            transform: rotateY(0deg);
        }

        100%{
            background: #ff0!important;
            transform: rotateY(360deg);
        }
    }
    .popContainer{
    }
    .frameContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        background: #fff;
        text-align: center;
        max-width: 840px;
        overflow-x: auto;

    }
    .frameGroupContainer{
        border: 0px solid #aaa;
        border-radius: 3px;
        margin-right: 12px;
        width: 100%;
        padding: 0px;
        text-align: center;
        overflow-y: auto;
        min-width: 165px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .frameGroupContainer > div{
        flex-shrink: 0;
        flex-grow: 0;
    }
    .itemContainer{
        background: #fff;
        margin-bottom: 4px;
        min-height: 100px;
        border: 1px solid #e8e8e8;
        border-radius: 5px;
        position: relative;
        cursor: move;
        margin-right: 4px;
        width: 160px;
    }
    .frameGroupContainer .itemContainer:last-child{
        margin-right: 0px;
    }
    .itemContainer img{
        height: 120px;
        width: auto;
    }
    .nameContainer{
        font-size: 12px;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .titleLabel{
        margin-top: 10px;
        margin-bottom: 10px;
        cursor: move;
    }
    .addBtnContainer{
        cursor: pointer;
        background: #bfcbd9;
        border-radius: 4px;
        padding: 7px 17px;
        color: #fff;
    }
    .operateContainer{
        position: absolute;
        top:0px;
        right: 0px;
        display: none;
    }

    .operateContainer span{
        background: url("http://ejiaziimg.goodaa.com.cn/pic_eaddbf41-852e-4fe8-a72d-0a52c360b77e.png") no-repeat center center;
        background-size: cover;
        cursor: pointer;
        margin-bottom: 0px;
        border:1px solid #fff;
        text-align: center;
        color: #fff;
        display: inline-block;
    }
    .noChooseTip{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 100%;
        background: rgba(0, 0, 0, 0.57);
        display: flex;
        height: 100%;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #ffffff;
    }
    .changeTip{
        position: absolute;
        top: 0px;
        right: 0px;
        width: 100%;
        background: rgba(0, 0, 0, 0.57);
        display: none;
        height: 100%;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #ffffff;
    }
    .itemContainer:hover .changeTip{
        display: flex;
    }
    .itemContainer:hover .operateContainer{
        width: 100%;
        height: 100%;
        padding-top: -10px;
        padding-right: -10px;
        display: block;
        text-align: right;
    }
    .btnsContainer{
        margin-top: 80px;
        margin-top: 40px;
    }
    .imageContainer{
        -webkit-background-size: contain!important;
        background-size: contain!important;
        position: relative;
        overflow: hidden;
        width: 160px!important;
        height: 100px!important;
    }
    .titleContainer{
        background: #f0f0f0;
        display: none!important;
        padding: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .titleContainer div:first-child{
        margin-bottom: 10px;
    }


    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar
    {
        width: 4px;
        height: 4px;
        background-color: #F5F5F5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: #fff;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #666;
    }

    .tipLabel{
        position: absolute;
        display: inline-block;
        background: rgba(23, 106, 249, 0.65);
        color: rgb(255, 255, 255);
        font-size: 12px;
        padding: 1px 8px;
        border-radius: 0px;
        transform: rotateZ(-45deg);
        left: -19px;
        width: 70px;
        top: 14px;
        line-height: 20px;
    }

    .chooseItemContainer{
        background: #fff;
        padding: 5px;
        padding-top: 5px;
        margin-bottom: 15px;
    }

    .chooseItemContainer > div{
        display: inline-block;
        padding: 5px 10px;
        font-size: 14px;
        border-radius: 3px;
        border:1px solid #0056aa;
        text-align: center;
        cursor: pointer;
        color:#0056aa ;
        background: #fff;
    }

    .advertTypeChoosed{
        background: #0051fb99!important;
        color: #fff!important;
        border: 1px solid #fff!important;
    }

    .switchContainer{
        display: inline-block;
        padding: 0px;
    }

    .switchContainer >div{
        padding: 5px 10px;
        border: 1px dashed #ccc;
        border-radius: 5px;
        color: #000;
        cursor: pointer;
    }

    .appInfoContainer{
        display: inline-block;
        width: 200px;
        color: #000;
        font-size: 12px;
    }
    .appInfoContainer span{
        display: block;
    }

    .chooseAppBtn{
        width: 130px;
        text-align: center;
        margin-right: 30px;
        color: #fff;display: inline-block;background: #3b97d7;border:1px solid #fff;border-radius: 5px;font-size: 14px;padding: 5px 10px;cursor: pointer;
    }
    .choosedAppItem{
        padding: 0px;position: relative;margin-right: 10px;
        display: flex;
        height: 88px;
        width: 100px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .channelAppForbidden{
        font-size:12px;line-height:80px;text-align:center;color: #f00;display: inline-block;position: absolute;background: rgba(0,0,0,0.5);width: 100%;height: 100%;top:0px;left:0px;color:#f00;
    }
    .chooseSpreadBtn{
        width: 130px;
        margin-right: 30px;
        text-align: center;
        color: #fff;display: inline-block;background: #97a8be;border:1px solid #fff;border-radius: 5px;font-size: 14px;padding: 5px 10px;cursor: pointer;
    }

    .mainViewContainer{
        padding: 0px;
    }
    .mainViewContainer >div:nth-child(1){
        flex-grow: 1;
        flex-shrink: 1;
    }
    .mainViewContainer >div:nth-child(2){
        flex-grow: 0;
        flex-shrink: 0;
    }
    .chooseItem{
        display: none;
    }
    .chooseItem + label{
        background: #fff url('http://img-steward-test.goodaa.com.cn/47b8be2b6fd441eabd319abaf9677115.png') no-repeat !important;
        background-position: 3px 1px!important;
        background-size: 51px 23px!important;
    }
    .chooseItem:checked + label{
        background: #fff url('http://img-steward-test.goodaa.com.cn/47b8be2b6fd441eabd319abaf9677115.png') no-repeat !important;
        background-position: -27px 1px!important;
        background-size: 52px 23px!important;
    }
    .checkItem{
        display: inline-block;
        width: 28px;
        height: 28px;
    }
    .myBtn{
        background: #333 !important;
        text-align: center;
        color: #fff!important;
        cursor: pointer;
    }
    .myBtnChecked{
        background: #fff !important;
        text-align: center;
        color: #333!important;
        cursor: pointer;
    }
</style>
<style>
    .myBtn{
        background: #333 !important;
        text-align: center;
        color: #fff!important;
        cursor: pointer;
    }

</style>
