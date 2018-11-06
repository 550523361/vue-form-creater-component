<template>
    <div >
            <div class="chooseResultContainer">
                    <span class="addInputItemGroupContainer" v-for="(group,index) in Object.keys(choosedResultArray)">
                        {{group}}
                        <span class="addInputItemContainer" v-for="(item,index) in choosedResultArray[group]">
                            <span class="deleteIcon" v-if="!config.readonly" @click="deleteItem(item,index)">×</span>
                                {{item.name}}
                        </span>
                    </span>
            </div>
            <!--<el-button type="success" @click="addCommunity" v-if="!showSearch">➕添加小区</el-button>-->
            <list-table v-if="!config.readonly && showSearch" :config="{tableListConfig,queryConfig,clickHandler,form:'propertyMerchant'}" :readData="readonly" ref="tableList"></list-table>
    </div>
</template>
<script>
    import TableConfig from 'vue-table-creater-component'
    const baseTableConfig=TableConfig.TableListConfig;
    import _ from "underscore";

    let tableListConfig=JSON.parse(JSON.stringify(baseTableConfig));
    let baseBtnStyle=tableListConfig.baseBtnStyle;
    let queryElements=[
        {

            label:'',
            type:'select',
            placeholder:'请输入省',
            dataUrl:'/region/queryProvinceList.json',
            prop:'provinceId',
            initQuery:true,
            httpMethod:"post",
            defaultValue:"",
            propList:'provinceList',
            propKeyList:'provinceList',
            propValueList:'data',
            noNeedAllParams:true,
            casecadeParen:"",
            casecadeChild:"cityId",
            casecadeGrandsonList:["cityId","districtId","communityId"]
        },
        {
            label:'',
            httpMethod:"post",
            type:'select',
            defaultValue:"",
            placeholder:'请输入市',
            dataUrl:'/region/queryCityListByPid.json',
            prop:'cityId',
            extendsProp:["provinceCode"],
            propList:'cityList',
            noNeedAllParams:true,
            propKeyList:'cityList',
            propValueList:'data',
            casecadeParen:"provinceId",
            casecadeChild:"districtId",
            casecadeGrandsonList:["districtId"]
        },
        {
            label:'',
            defaultValue:"",
            type:'select',
            httpMethod:"post",
            dataUrl:'/region/queryDistrictListByPid.json',
            placeholder:'请选择区',
            prop:'districtId',
            extendsProp:["cityCode"],
            propList:'districtList',
            propKeyList:'districtList',
            propValueList:'data',
            casecadeParen:"cityId",
            casecadeChildDataUrl:"",
            casecadeChildListProp:"data",
            casecadeChild:"",
            form:"cityId"
        },
        {
            label:'',
            type:'input',
            placeholder:'小区名称',
            prop:'communityName'
        },
        {
            label:'物业ID',
            type:'hidden',
            placeholder:'物业ID',
            prop:'propertyId',
            defaultValue:0,
            default:0
        },
        {
            label:'搜索',
            type:'search',
            check: function (queryParam) {
                if(queryParam){
                    console.log("check",queryParam)
                    if(queryParam.cityId>0){
                        queryParam.cityCode=queryParam.cityId;
                        queryParam.cityType=1;
                    }else{
                        return Promise.reject({code:0,msg:"请先选择省份和城市再搜索"})
                    }
                    if(queryParam.districtId>0){
                        queryParam.cityCode=queryParam.districtId;
                        queryParam.cityType=2;
                    }
                    return {params:queryParam}
                }
            }
        }   ,
    ];


    tableListConfig.url="/mall/community/queryCommunityByCity.json";
    tableListConfig.query={
        pageNum: 1,
        pageSize: 15,
        state:'',
        type:'',
        startDate:'',
        endDate:'',
        text:'',
        orderByUpdateTime:'desc',
        extensionType:'',
    };
    tableListConfig.colums=[{"prop":"provinceName",label:"省份",width:'100'},{"prop":"cityName",label:"城市",width:'160'},{"prop":"name",label:"小区名称",width:'auto'}]

    export default {
        name: 'community-choose',
        components:{
        },
        data(){
            return{
                showSearch:true,
                config:{},
                form:{},
                items:[],
                readonly:{},
                tableListConfig:{},
                queryConfig:{},
                chooseResult:{},
                catchListData:{}
            }
        },
        methods:{
            addCommunity(){
                this.showSearch=true;
            },
            saveInput(param){
                console.log(param,this.form);
                this.items.push(this.form[this.config.prop]);
                this.form[this.config.prop]="";
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,this.items.map(item=>item.id));
                    }
                }
            },
            chooseAllClick(items,index){
                console.log("chooseAllClick",items)
                let that=this;
                that.chooseResult={};
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,items.map(item=>{
                            that.chooseResult[item.id]=item;
                            return item.id;
                        }));
                    }
                }
            },
            clickHandler(param,btnInfo,chooseData){
                console.log("index --99000- clickHandler",param,btnInfo,chooseData)
                this.$nextTick()
            },
            clickChooseCommunityHandler(param,btnInfo,chooseData){
                console.log("index --99000- clickChooseCommunityHandler",param,btnInfo,chooseData)
                let that=this;
                // this.chooseAllClick()
                this.$nextTick(function () {
                    if(!param.idCheck){
                        let deleteResult=this.deleteItem(param);
                        console.log("deleteResult",deleteResult)
                        if(deleteResult instanceof Promise){
                            deleteResult.then(success=>{
                                console.log("deleteResult success",success)
                                if(success){
                                    param.idCheck=true;
                                }
                            },error=>{
                                console.log("deleteResult error",error)
                            })
                        }
                    }else{
                        let addResult=that.addItem(param);
                        console.log("addResult",addResult)
                        if(addResult instanceof Promise){
                            addResult.then(success=>{
                                console.log("addResult success",success)
                                if(success){
                                    param.idCheck=true;
                                    that.chooseResult[param.id]=param;
                                    that.syncData();
                                }
                            },error=>{
                                console.log("addResult error",error)
                            })

                        }else{
                            that.chooseResult[param.id]=param;
                            that.syncData();
                        }

                    }
                })

            },
            clickUseBtnHandler(param,btnInfo){
                //console.log("index --99000- clickUseBtnHandler",param,btnInfo)
                let oldStyle=btnInfo.style;
                if(!btnInfo[btnInfo.prop+"Check"]){
                    btnInfo.rowStyle=null;
                }else{
                    btnInfo.rowStyle=Object.assign(JSON.parse(JSON.stringify(oldStyle||{})),{
                        backgroundColor:"#f0f",
                        color:'#fff'
                    })
                }

            },
            clickConfig(param){
                console.log("clickConfig***++++++*****",param);
            },
            check: function (queryParam) {
                if(queryParam){
                    var communityName=queryParam.communityName||"";
                    communityName=communityName.replace(/^\s+/,"").replace(/\s+$/,"");
                    if(communityName==""){
                        return true;
                    }

                }
                return true;
            },
            pagerDataHelper(param){
                //console.log("pagerDataHelper",param)
                /*param.map(item=>{
                    item.stateName=item.state==1?"显示":"隐藏";
                    item.displyName=item.display==1?"显示":"隐藏";
                    //item.tagsStr=item.tags.join(",");
                    return item;
                })*/

                /*param.map(item=>{
                    item.checkedClass=true;
                    return item;
                })*/
                let that=this;
                param.map(item=>{
                    item.idCheck=that.chooseResult[item.id]?true:false;
                })
                that.catchListData=param;
                return {content:param};
            },
            uncheckItem(deleteItem){
                let that=this;
                if(that.catchListData.length){
                    console.log("that.catchListData",that.catchListData)
                    that.catchListData.forEach(item=>{
                        if(item.id==deleteItem.id){
                            item.idCheck=false;
                        }
                    })
                }

            },
            checkItem(addItem){
                let that=this;
                if(that.catchListData.length){
                    console.log("that.catchListData",that.catchListData)
                    that.catchListData.forEach(item=>{
                        if(item.id==addItem.id){
                            item.idCheck=true;
                        }
                    })
                }

            },
            addItem(item,index){
                let that=this;
                if(that.config.beforeAdd&&typeof that.config.beforeAdd == "function"){
                    let checkResult=that.config.beforeAdd(item,index);
                    if(checkResult instanceof Promise){
                        return checkResult.then(success=>{
                            that.chooseResult[item.id]=item;
                            that.checkItem(item);
                            that.syncData();
                        },error=>{
                            if(!error.msg)return;
                            that.$message({
                                type:'error',
                                message:error.msg
                            })
                            return error;
                        })
                    }else if(checkResult){
                        that.chooseResult[item.id]=item;
                        that.checkItem(item);
                        that.syncData();
                    }
                }else{
                    that.chooseResult[item.id]=item;
                    that.checkItem(item);
                    that.syncData();
                }
            },
            deleteItem(item,index){
                let that=this;
                if(that.config.beforeDelete&&typeof that.config.beforeDelete == "function"){
                    let checkResult=that.config.beforeDelete(item,index);
                    if(checkResult instanceof Promise){
                        return checkResult.then(success=>{
                            delete that.chooseResult[item.id];
                            that.uncheckItem(item);
                            that.syncData();
                        },error=>{
                            if(!error.msg)return;
                            that.$message({
                                type:'error',
                                message:error.msg
                            })
                            return error;
                        })
                    }else if(checkResult){
                        delete that.chooseResult[item.id];
                        that.uncheckItem(item);
                        that.syncData();
                    }
                }else{
                    delete that.chooseResult[item.id];
                    that.uncheckItem(item);
                    that.syncData();
                }
            },
            syncData(){
                let that=this;
                that.$nextTick(function () {
                    that.chooseResult=JSON.parse(JSON.stringify(that.chooseResult))
                    if(that.config.dataBus){
                        if(typeof that.config.dataBus ==="function"){
                            that.config.dataBus(that.config,Object.values(that.chooseResult).filter(item=>item!=null).map(item=>{
                                return item.id;
                            }));
                        }
                    }
                })

            },
            headerClick(column,eventData,listData){
                console.log("headerClick***++++++*****",column,eventData,listData);
                column.label=column.label=='取消'?'全选':'取消';
                listData.content&&listData.content.map(item=>item['idCheck']=!item.idCheck);
            },
        },
        computed:{
            choosedResultArray:function(){
                return _.groupBy(Object.values(this.chooseResult),"provinceName");
            }
        },
        created() {
            let that=this;
            let readonly=this.$attrs.readData;
            that.readonly=readonly;
            console.log("readonly",this.$attrs)
            /*that.$watch("readonly",function (newData,oldData) {
                console.log("newData,oldData",newData,oldData)
                that.readonly.propertyId=newData.propertyId;
                that.$refs.tableList.$on("readonlyDataChanged",newData)
            },{
                deep:true
            })*/
            let config=this.$attrs.config;
            //console.log("config",config);
            this.config=config;
            let formData=config.formData;
            if(formData){
                (formData||[]).forEach(item=>{
                    item.from="db";
                    that.chooseResult[item.id]=item;
                })
                if(this.config.dataBus){
                    console.log("that.chooseResult",that.chooseResult)
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,Object.values(that.chooseResult));
                    }
                }
            }
            //tableListConfig.selection=true;
            tableListConfig.headerClick=that.headerClick;
            this.queryConfig.queryElements=queryElements;
            //this.queryConfig.queryElements[5].check=this.check;
            tableListConfig.operator={width:100,column:[
                    {"prop":"id",label:"选择",type:'checkbox',click:that.clickChooseCommunityHandler,
                        style:Object.assign(JSON.parse(JSON.stringify(baseBtnStyle)),{backgroundColor:'#97a8be',color:'#fff'}),
                        checkedStyle:Object.assign(JSON.parse(JSON.stringify(baseBtnStyle)),{backgroundColor:'#000',color:'#fff'}),
                    },
                ]}
            tableListConfig.pagerDataHelper=that.pagerDataHelper;
            tableListConfig.chooseAllClick=that.chooseAllClick;
            that.tableListConfig=Object.assign(that.tableListConfig,tableListConfig);



        }
    }
</script>

<style scoped>
    #container {
        height: 300px;
        width:750px;
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
    .addInputItemGroupContainer{
        display: block;
        text-align: left;
    }

</style>
