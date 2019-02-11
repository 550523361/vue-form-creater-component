<template>
    <div class="addElement">
        <div style="padding: 15px 5px;background: #f0f0f0;">
            <el-radio v-model="type" :label="element" style="margin-left: 0px;"  v-for="(element,index) in Object.keys(elementConfig)" :key="index+'_radio_'+element" >{{elementConfig[element].name}}</el-radio>
        </div>
        <div v-for="(element,index) in Object.keys(elementConfig)" v-if="type==element" style="background:#dfe6ec;padding: 10px 5px;"  :key="index+''+element">
            <span v-if="elementConfig[element][elementOption].name" v-for="(elementOption,index) in Object.keys(elementConfig[element])" :key="index+'_radio_option_'+element">
                <div v-if="elementConfig[element][elementOption].name=='br'"  style="background: transparent;height: 15px;"></div>
                <template v-else="elementConfig[element][elementOption].name=='br'"  style="background: #f0a;">
                    <el-radio v-model="elementItemType"  :label="elementOption"   >{{elementConfig[element][elementOption].name}}</el-radio>
                </template>
            </span>
            <div style="margin-top: 15px;background: transparent"></div>
            <span v-for="(elementType,index) in Object.keys(elementConfig[element])" v-if="element==type&&elementItemType==elementType"  :key="index+''+element+'_'+elementType">
                <el-input v-model="elementConfig[type][elementItemType].options" type="textarea" :rows="10" @keyup.enter.native="saveInput" ></el-input>
                <div style="font-size: 12px;color: #f00;margin-top: 5px;">{{elementConfig[element].name}}==>{{elementConfig[element][elementType].name}}--{{elementType}}---{{type}}--->{{elementItemType}}</div>
            </span>
        </div>
        <el-button type="info" style="margin-top: 15px;" @click="addQueryElement">确定</el-button>
    </div>
</template>
<script>
    export default {
        name: 'add-element-input',
        data(){
            return{
                type:'queryParams',
                elementItemType:'input',
                config:{},
                form:{},
                items:[],
                elementConfig:{
                    dataUrl:{
                        name:'数据列表接口',
                        input:{
                            name:'输入框数据请求接口',
                            options:JSON.stringify({
                                url:'/mall/merchant/list.json',
                                httpMethod:'post'
                            },null ,4)
                        },
                    },
                    queryParams:{
                        name:'列表查询参数',
                        br0:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        input:{
                            name:'输入框',
                            options:JSON.stringify({
                                label:'店铺名称/ID',
                                type:'input',
                                placeholder:'请输入店铺名称/ID',
                                prop:'key'
                            },null ,4)
                        },
                        br01:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        province:{
                         name:'选择省',
                         options:JSON.stringify({
                                 label:'选择省',
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
                             },null,4)
                        },
                        city:{
                         name:'选择市',
                         options:JSON.stringify(
                             {
                                 label:'选择市',
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

                             },null,4)
                        },
                        area:{
                         name:'选择区',
                         options:JSON.stringify(
                             {
                                 label:'选择区',
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
                             },null,4)
                        },
                        br201:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        select:{
                            name:'下拉选择',
                            options:JSON.stringify({
                                label:'店铺状态',
                                placeholder:'全部',
                                defaultValue:"",
                                type:'select',
                                prop:'state',
                                options:[
                                    {
                                        label:'信息待补充',
                                        value:1
                                    },
                                    {
                                        label:'开店中',
                                        value:2
                                    },
                                    {
                                        label:'已关闭',
                                        value:3
                                    },
                                ]
                            },null ,4),
                        },
                        selectUrl:{
                            name:'下拉选择Url',
                            options:JSON.stringify({
                                label:'店铺状态',
                                placeholder:'全部',
                                defaultValue:"",
                                type:'select',
                                prop:'state',
                                httpMethod:'post',
                                dataUrl:'/mall/order/getOrderQueryStateList.json',
                                propList:'orderStateList',
                                propKeyList:'orderStateList',
                                propValueList:'data',
                                initQuery:true,
                                options:[
                                    {
                                        label:'信息待补充',
                                        value:1
                                    },
                                    {
                                        label:'开店中',
                                        value:2
                                    },
                                    {
                                        label:'已关闭',
                                        value:3
                                    },
                                ]
                            },null ,4),
                        },
                        br1:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        timeRange:{
                          name:'时间范围选择',
                          options:JSON.stringify(
                              {
                                  label:'时间范围',
                                  type:'datetimerange',
                                  placeholder:'请选择下单时间范围',
                                  prop:'timeRange',
                                  startLabel:'开始时间',
                                  endLabel:'结束时间',
                                  options:{
                                      shortcuts: [{
                                          text: '最近一周',
                                          onClick(picker) {
                                              const end = new Date();
                                              const start = new Date();
                                              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                              picker.$emit('pick', [start, end]);
                                          }
                                      }, {
                                          text: '最近一个月',
                                          onClick(picker) {
                                              const end = new Date();
                                              const start = new Date();
                                              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                              picker.$emit('pick', [start, end]);
                                          }
                                      }, {
                                          text: '最近三个月',
                                          onClick(picker) {
                                              const end = new Date();
                                              const start = new Date();
                                              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                              picker.$emit('pick', [start, end]);
                                          }
                                      }]
                                  },

                              }
                              ,null,4)
                        },
                        br21:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        tabsUrl:{
                            name:'tab页面Url动态查询',
                            options:JSON.stringify(
                                {
                                    label:'显示状态',
                                    placeholder:'全部',
                                    defaultValue:"0",
                                    default:"0",
                                    type:'tab',
                                    prop:'stateUrl',
                                    httpMethod:'post',
                                    dataUrl:'/mall/order/getOrderQueryStateList.json',
                                    propList:'orderStateList',
                                    propKeyList:'orderStateList',
                                    propValueList:'data',
                                    initQuery:true,
                                    /*click:function(){
                                        console.log("orderStateList")
                                    },*/
                                    dataHandler(data){
                                        console.log("dataHandler",data);
                                        data.data.map(item=>{
                                            item.id=item.code;
                                            item.label=item.desc;
                                        })

                                        return [{
                                            id:"0",
                                            label:'全部',
                                            code:"0",
                                        }].concat(data.data);
                                    },
                                    components:[
                                        {
                                            label:'信息待补充',
                                            value:1
                                        },
                                        {
                                            label:'开店中',
                                            value:2
                                        },
                                        {
                                            label:'已关闭',
                                            value:3
                                        },
                                    ]
                                },null,4)
                        },
                        tabs:{
                            name:'tab页面固定值',
                            options:JSON.stringify(
                                {
                                    label:'显示状态',
                                    placeholder:'全部',
                                    defaultValue:"0",
                                    default:"0",
                                    type:'tab',
                                    prop:'state',
                                    /*click:function(){
                                        console.log("orderStateList")
                                    },*/
                                    components:[
                                        {
                                            label:'信息待补充',
                                            value:1
                                        },
                                        {
                                            label:'开店中',
                                            value:2
                                        },
                                        {
                                            label:'已关闭',
                                            value:3
                                        },
                                    ]
                                },null,4)
                        },
                        br:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        button:{
                            name:'按钮',
                            options:JSON.stringify({
                                label:'创建店铺',
                                type:'button',
                                param:true
                            },null ,4)
                        },
                        downloadButton:{
                            name:'下载按钮',
                            options:JSON.stringify({
                                label:'下载按钮',
                                type:'button',
                                exportBtn:true,
                                param:true,
                                url:"/mall/order/exportOrderList",
                                exportsParam:{
                                    id:"",
                                    name:"",
                                }
                            },null ,4)
                        },
                        search:{
                            name:'搜索按钮',
                            options:JSON.stringify({
                                label:'搜索',
                                type:'search',
                                check: function (queryParam) {
                                    console.log("queryParamqueryParamqueryParam",queryParam);
                                    if(queryParam){
                                        var communityName=queryParam.communityName||"";
                                        communityName=communityName.replace(/^\s+/,"").replace(/\s+$/,"");
                                        if(communityName==""){
                                            return true;
                                        }

                                    }
                                    return true;
                                }.toString()
                            },null ,4)
                        }
                    },
                    columns:{
                        name:'表列展示列',
                        normal:{
                            name:'普通列',
                            options:JSON.stringify({
                                label:'名称',
                                type:'',
                                placeholder:'填写要显示的字段',
                                prop:'name',
                                "addEventListener": [
                                    "enter"
                                ]
                            },null ,4)
                        },
                        br31:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        input:{
                            name:'输入框',
                            options:JSON.stringify({
                                label:'输入完成后回车',
                                type:'input',
                                placeholder:'输入后回车保存',
                                prop:'keyInput',
                                "addEventListener": [
                                    "enter"
                                ]
                            },null ,4)
                        },
                        order:{
                            name:'排序输入框',
                            options:JSON.stringify({
                                "prop": "orderNum",
                                "label": "分类排序",
                                "width": "100",
                                "type": "input",
                                "addEventListener": [
                                    "enter"
                                ]
                            },null ,4)
                        },
                        br1:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        img:{
                            name:'图片显示',
                            options:JSON.stringify({
                                label:'商品图片',
                                type:'img',
                                placeholder:'商品图片',
                                prop:'url',
                                width:200,
                                addEventListener:[
                                    'click'
                                ]
                            },null ,4)
                        },
                        br11:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        html:{
                            name:'自定义显示内容',
                            options:JSON.stringify({
                                label:'店铺名称/ID',
                                type:'',
                                placeholder:'请输入店铺名称/ID',
                                prop:'key',
                                html:true,
                                viewHandler:"1231231",
                                columnHandlerText:"我要显示成彩色的啊"
                            },null ,4)
                        },
                        viewHandler:{
                            name:'自定义显示内容',
                            options:JSON.stringify({
                                label:'收货地址',
                                type:'',
                                placeholder:'展示属性',
                                prop:'keyFree',
                                columnHandlerDemo:`function (param) {if(!param) return param;return param.map(item=>item.name).join(',');}`
                            },null ,4)
                        },
                        addressHandler:{
                            name:'收货地址测试啊',
                            options:JSON.stringify({
                                "label": "收货地址",
                                "columnHandler":"2323",
                                "type": "",
                                "html":"true",
                                "width":400,
                                "placeholder": "展示属性",
                                "prop": "mallOrderAddress",
                                "columnHandlerDemo": "function (param) {if(!param) return param;return param.map(item=>item.name).join(',');}",
                                "columnHandlerText":["<span style='color:#f00'>##communityName##</span>","<div style='color:#f0f'>##phone##</div>"]
                            },null,4)
                        },
                        goodsInfoHandler:{
                            name:'商品信息展示',
                            options:JSON.stringify({
                                "label": "收货地址",
                                "columnHandler":"2323",
                                "type": "",
                                "html":"true",
                                "width":200,
                                addEventListener:[
                                    'click'
                                ],
                                "placeholder": "展示属性",
                                "prop": "mallOrderProductDtoList",
                                "columnHandlerDemo": "function (param) {if(!param) return param;return param.map(item=>item.name).join(',');}",
                                "columnHandlerText":["<span style='color:#f00'>##merchantProductName##</span>","<div style='color:#f0f'><span style='color: #2D64B3;'>购买数量:</span>##buyCount##</div>","<div><img style='max-width: 40px;' src='##productDetailPicUrl##' alt=''></div>"]
                            },null,4)
                        }
                    },
                    operators:{
                        name:'行操作按钮',
                        button:{
                            name:'普通按钮',
                            options:JSON.stringify({
                                label:'请输入按钮名称',
                                type:'button',
                                placeholder:'',
                                prop:'id'
                            },null ,4)
                        },
                        br11:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        buttonView:{
                            name:'查看按钮',
                            options:JSON.stringify({
                                label:'查看',
                                type:'button',
                                placeholder:'',
                                prop:'id',
                                url:'/goodsOrderManager/info/368/list',
                            },null ,4)
                        },
                        buttonChange:{
                            name:'修改按钮',
                            options:JSON.stringify({
                                label:'修改',
                                type:'button',
                                placeholder:'',
                                prop:'id',
                                url:'/goodsOrderManager/info/368/list',
                            },null ,4)
                        },
                        buttonDelete:{
                            name:'删除按钮',
                            options:JSON.stringify({
                                label:'删除',
                                type:'button',
                                placeholder:'',
                                prop:'id',
                                url:'/mall/order/queryListPage.json',
                                deleteTipText:'确定要删除##orderNum##吗?',
                                confirmDel:'true',
                                deleteParam:{
                                    id:'####',
                                    state:{
                                        1:2,
                                        2:3,
                                        3:4,
                                    }
                                }
                            },null ,4)
                        },
                        br21:{
                            name:'br',
                            options:JSON.stringify({
                                label:'换行排版',
                                type:'br',
                            })
                        },
                        map:{
                            name:'map类型按钮',
                            options:JSON.stringify({
                                label:'',
                                type:'mapButton',
                                placeholder:'',
                                prop:'state',
                                map:{
                                    2:'删除',
                                    3:'修改',
                                },
                                viewHandler:true
                            },null ,4)
                        },
                    }

                }
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
            addQueryElement(){
                if(this.config.dataBus){
                    if(typeof this.config.dataBus ==="function"){
                        this.config.dataBus(this.config,JSON.parse(this.elementConfig[this.type][this.elementItemType].options),{
                            functionType:this.type,
                            elementType:this.elementItemType,
                        });
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
<style>
    .addElement .el-radio{
        min-width: 165px;
        margin-right: 10px;
    }
</style>
