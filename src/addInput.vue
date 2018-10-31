<template>
    <div>
        <el-form-item :label="config.innerlabel||''">
            <el-col :span="5" v-if="!config.readonly">
                <el-input v-model="form[config.prop]" @keyup.enter.native="saveInput" ></el-input>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="8" style="padding-left: 15px;">
                    <span class="addInputItemContainer" v-for="(item,index) in items">
                        <span class="deleteIcon"  v-if="!config.readonly" @click="deleteItem(item,index)">×</span>
                        {{item}}
                    </span>
            </el-col>
        </el-form-item>
        <div style="color:#1d90e6;font-size: 12px;line-height: 20px;" v-if="!config.readonly">
            <div>1. 支持配置多个标签，每个标签填写后按enter完成输入；</div>
            <div>2. 该标签将用于语音搜索，所以越准确越好，举例：商品‘农夫山泉矿泉水，标签可写为：水、矿泉水、农夫山泉、饮用水、瓶装水</div>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'

    export default {
        name: 'add-input',
        data(){
            return{
                config:{},
                form:{},
                items:[]
            }
        },
        methods:{
            saveInput(param){
                console.log(param,this.form);
                if(!this.form[this.config.prop]) return;
                this.items.push(this.form[this.config.prop]);
                this.form[this.config.prop]="";
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,this.items);
                    }
                }
            },
            deleteItem(item,index){
                this.items.splice(index,1);
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,this.items);
                    }
                }
            }
        },
        created() {
            let config=this.$attrs.config;
            console.log("config",config);
            this.config=config;
            let formData=config.formData;
            if(formData){
                /*Object.keys(formData).forEach(key=>{
                    that.$set(that.form,key,formData[key]);
                })*/
                this.items=JSON.parse(JSON.stringify(formData))
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,this.items);
                    }
                }
            }

        }
    }
</script>

<style scoped>
    #container {
        height: 300px;
        width:800px;
    }

    .queryElement{
        display: block;
        width: 100%;
        border:0px solid #f00;
    }
    .addInputItemContainer{
        display: inline-block;
        padding: 5px 10px;
        border:1px solid #f00;
        border-radius: 5px;
        color: #f00;
        line-height: 20px;
        margin-right: 10px;
        margin-bottom: 10px;
        position: relative;
    }
    .deleteIcon{
        display: inline-block;
        position: absolute;
        right: -8px;
        top: -8px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        background: #f00;
        color: #fff;
        border-radius: 50%;
        cursor: pointer;
    }
</style>
