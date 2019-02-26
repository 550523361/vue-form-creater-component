<template :key="formKey">
    <div :class="{readonlyContainer:readonly}">
        <div class="searchContainer" >
            <div class="elementsContainer">
                <el-form ref="form" :model="form" :rules="rules" :label-width="$attrs.config.labelWidth||'180px'">
                      <span class="queryElement" :class="{
                              hidden:queryItem.type=='hidden',
                              tabContainer:queryItem.type=='tab',
                              tableClass:queryItem.type=='communityChoose',
                              switchContainer:queryItem.switchElements,
                              switchElement:queryItem.switchElements
                            }" v-for="(queryItem,eleIndex) in queryElements"
                            :key="queryItem.prop+'_'+queryItem.label+'_'+eleIndex"
                      >
                            <template  v-if="queryItem.type=='input'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  >
                                <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                                  <el-col :span="queryItem.span||8">
                                    <template v-if="queryItem.preText">{{queryItem.preText}}</template>
                                    <el-input :type="queryItem.inputType||''" :style="queryItem.style||{}" :rows="queryItem.rows||1" v-model="form[queryItem.prop]" :disabled="queryItem.readonly||readonly" :placeholder="queryItem.placeholder">
                                    </el-input>
                                    <template v-if="queryItem.subText"><span v-html="queryItem.subText"></span></template>
                                    <div style="color: #f00;font-size: 12px;line-height: 20px;">
                                        {{queryItem.tip}}
                                    </div>
                                  </el-col>
                                </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='date'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  >
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                                  <el-date-picker type="date" :placeholder="queryItem.placeholder" v-model="form[queryItem.prop]" ></el-date-picker>
                                </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='button'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  >
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                                    <el-button :class="queryItem.class" :type="queryItem.type||'info'" :style="queryItem.style" @click="queryItem.click&&queryItem.click(queryItem)">{{queryItem.buttonLabel}}</el-button>
                                </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='upload'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  >
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                                  <img :src="form[queryItem.prop]" style="width: 100px;height: 100px;vertical-align: middle;" alt="">
                                  <el-upload
                                          class="upload-demo"
                                          name="file"
                                          :show-file-list="false"
                                          :data="form"
                                          :ref="'import_'+queryItem.prop"
                                          :auto-upload="queryItem.autoUpload||true"
                                          :action="queryItem.url"
                                          :on-change="function(param){
                                            return onchangeUpload(param,queryItem)
                                          }"
                                          :disabled="readonly"
                                          :before-upload="function(file) {
                                            return beforeIconUpload(file,queryItem)
                                          }"
                                          :on-success="function(response, file, fileList) {
                                            return saveAppSuccess(response, file, fileList,queryItem)
                                          }">
                                        <el-button size="small" type="primary" v-if="!readonly">点击上传</el-button>
                                        <div slot="tip" class="el-upload__tip">
                                            {{queryItem.tip}}
                                        </div>
                                  </el-upload>
                                    <!--<el-input v-model="form[queryItem.prop]" style="display: none" placeholder=""></el-input>-->
                                </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='import'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  >
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                                  <img :src="form[queryItem.prop]" style="width: 100px;height: 100px;vertical-align: middle;" alt="">
                                  <el-upload
                                          class="upload-demo"
                                          name="file"
                                          :show-file-list="true"
                                          :data="form"
                                          :ref="'import_'+queryItem.prop"
                                          :auto-upload="false"
                                          :action="queryItem.url"
                                          :on-change="function(param){
                                            return onchangeUpload(param,queryItem)
                                          }"
                                          :disabled="readonly"
                                          :before-upload="function(file) {
                                            return beforeIconUpload(file,queryItem)
                                          }"
                                          :on-success="function(response, file, fileList) {
                                            return saveAppSuccess(response, file, fileList,queryItem)
                                          }">
                                        <el-button size="small" type="primary" v-if="!readonly">{{queryItem.buttonLabel||'点击上传'}}</el-button>
                                        <div slot="tip" class="el-upload__tip">
                                            {{queryItem.tip}}
                                        </div>
                                  </el-upload>
                                    <!--<el-input v-model="form[queryItem.prop]" style="display: none" placeholder=""></el-input>-->
                                </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='addInput'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  > 
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                                    <add-input :config="queryItem"></add-input> 
                                    <span style="display: none"> 
                                        <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                                    </span> 
                                </el-form-item> 
                            </template> 
                            <template  v-if="queryItem.type=='chooseBtn'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  :style="{'margin-top':'10px','padding-right': '10px',width:queryItem.width||'100%',display: 'inline-block'}"> 
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                                    <choose-btn :config="queryItem" :readData="form"></choose-btn> 
                                    <span style="display: none"> 
                                        <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                                    </span> 
                                </el-form-item> 
                            </template>
                            <template  v-if="queryItem.type=='communityChoose'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  :style="{'margin-top':'10px','padding-right': '10px',width:queryItem.width||'100%',display: 'inline-block'}"> 
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                                    <community-choose :config="queryItem" :readData="form"></community-choose> 
                                    <span style="display: none"> 
                                        <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                                    </span> 
                                </el-form-item> 
                            </template>
                            <template  v-if="queryItem.type=='communityPropertyChoose'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"   :style="{'margin-top':'10px','padding-right': '10px',width:queryItem.width||'100%',display: 'inline-block'}"> 
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                                    <community-property-choose :config="queryItem" :readData="form"></community-property-choose> 
                                    <span style="display: none"> 
                                        <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                                    </span> 
                                </el-form-item> 
                            </template>
                            <template  v-if="queryItem.type=='switchBtn'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)"  >
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                                  <el-switch :placeholder="queryItem.placeholder" v-model="form[queryItem.prop]"></el-switch>
                                </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='checkbox'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)">
                                <span v-if="!queryItem.dataUrl">
                                  <el-form-item :label="queryItem.label" :prop="queryItem.prop" >
                                    <el-checkbox-group v-model="form[queryItem.prop]"  >
                                      <el-checkbox v-for="item in queryItem.items" :label="item.code"  :key="item.code+item.value+item.id+'_checkbox'+item.label+'_'+eleIndex">{{item.label}}</el-checkbox>
                                    </el-checkbox-group>
                                  </el-form-item>
                                </span>
                                <span v-if="queryItem.dataUrl">
                                  <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                                    <el-checkbox-group v-model="form[queryItem.prop]">
                                      <el-checkbox-button v-for="item in dataQuery.query[queryItem.propList]" :key="item.code+item.value+item.id+'_checkbox'+item.label+'_'+eleIndex" :label="item.label" :name="queryItem.prop+'checkbox'"></el-checkbox-button>
                                    </el-checkbox-group>
                                  </el-form-item>
                                </span>
                            </template>
                            <template  v-if="queryItem.type=='radio'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)">
                                <template v-if="!queryItem.dataUrl">
                                  <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                                    <el-radio-group v-model="form[queryItem.prop]" :size="queryItem.items.length+''">
                                      <el-radio border v-for="item in queryItem.items" :disabled="queryItem.readonly||readonly" :label="item.code" :name="queryItem.prop+'checkbox'" :key="item.code+item.value+item.id+'_radio'+item.label+'_'+eleIndex">{{item.label}}</el-radio>
                                    </el-radio-group>
                                  </el-form-item>
                                </template>
                                <template v-if="queryItem.dataUrl">
                                  <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                                    <el-radio-group v-model="form[queryItem.prop]">
                                      <el-radio border v-for="item in dataQuery.query[queryItem.propList]" :label="item.code" :name="queryItem.prop+'checkbox'" :key="item.code+item.value+item.id+'_radio'+item.label+'_'+eleIndex">{{item.label}}</el-radio>
                                    </el-radio-group>
                                  </el-form-item>
                                </template>
                            </template>
                            <template   v-if="queryItem.type=='html'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)">
                                    <el-form-item :prop="queryItem.prop" :label="queryItem.label" :style="queryItem.style||{}" :class="queryItem.className">
                                        <div v-html="form[queryItem.prop]" :style="{background: queryItem.background||'#9c9c9c'}"></div>
                                    </el-form-item>
                            </template>
                          <template   v-if="queryItem.type=='addImages'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)">
                                    <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                                        <add-images :config="queryItem.imagesListConfig||{}"></add-images>
                                    </el-form-item>
                            </template>
                            <template  v-if="queryItem.type=='select'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)">
                                <template v-if="!queryItem.dataUrl">
                                  <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                                    <el-select v-model="form[queryItem.prop]" :placeholder="queryItem.defaultLabel" :disabled="queryItem.readonly||readonly" @change="changeQueryParam(queryItem)">
                                      <el-option :label="queryItem.defaultLabel||'请选择'" :value="queryItem.defaultValue||''"></el-option>
                                      <el-option  v-for="(component,componentIndex) in queryItem.options" :value="component.value||component.code||component.id" :label="component.label||component.name" :key="component.code+component.value+component.id+'_select'+component.label+'_'+eleIndex+'_'+componentIndex"></el-option>
                                    </el-select>
                                  </el-form-item>
                                </template>
                                <template v-if="queryItem.dataUrl">
                                  <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                                    <el-select v-model="form[queryItem.prop]" :placeholder="queryItem.defaultLabel" :disabled="queryItem.readonly||readonly" @change="changeQueryParam(queryItem)">
                                      <el-option :label="queryItem.defaultLabel||'请选择'" :value="queryItem.defaultValue||''"></el-option>
                                      <el-option  v-for="(component,componentIndex) in dataQuery.query[queryItem.propList]" :value="component.value||component.code||component.id" :label="component.label||component.name||component.desc" :key="component.code+component.value+component.id+'_select'+component.label+'_'+eleIndex+'_'+componentIndex"></el-option>
                                    </el-select>
                                  </el-form-item>
                                </template>
                            </template>
                            <template  v-if="queryItem.type=='datetimerange'&&(queryItem.watch&&queryItem.watch.props?queryItem.watch.props.map(prop=>{
                                return queryItem.watch.watchValue[prop]&&queryItem.watch.watchValue[prop][form[prop]]!=true
                            }).filter(item=>item==true).length==0:true)">
                                <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                                    <el-date-picker
                                            v-model="form[queryItem.prop]"
                                            :type="queryItem.dateType||'datetimerange'"
                                            :disabled="queryItem.readonly||readonly"
                                            :picker-options="queryItem.options"
                                            :range-separator="queryItem.centerLabel||'至'"
                                            :placeholder="queryItem.placeholder||'请选择时间范围'"
                                            :format="queryItem.format||'yyyy-MM-dd hh:mm:ss'"
                                            @change="data=>{
                                                form[queryItem.prop]=data.split((queryItem.centerLabel||'至'));
                                            }"
                                            align="right">
                                    </el-date-picker>
                                </el-form-item> 
                            </template>
                      </span>
                        <template v-if="!$attrs.config.noneSaveBtn">
                            <el-button type="primary" v-if="!readonly" @click="submitForm('form')" :style="$attrs.config.confirmBtnStyle||{width:'220px'}">{{$attrs.config.saveBtnlabel||(form["id"]?"立即更新":'立即创建')}}</el-button>
                            <!--<el-button @click="resetForm('form')">重置</el-button>-->
                            <el-button @click="cancle" :style="$attrs.config.cancleBtnStyle||{width:'220px'}">取消</el-button>
                        </template>
                </el-form>
                <!--{{form}}
                <hr>
                {{rules}}-->
            </div>
            <!--<div class="btnContainer">
                      <span v-for="queryItem in queryButtons">
                              <span class=" label_checkbox" v-if="queryItem.type=='search'">
                                <label class="btn btn-default borderGreen"  @click="queryBtnClick(form,queryItem)">{{queryItem.label}}</label>
                              </span>
                              <span class=" label_checkbox"  v-if="queryItem.type=='button'">
                                  <label :class="['btn','btn-default','borderGreen','el-button&#45;&#45;primary',queryItem.btnClass]" v-if="queryItem.param"  @click="queryBtnClick(form,queryItem)">{{queryItem.label}}</label>
                                  <label :class="['btn','btn-default','borderGreen','el-button&#45;&#45;primary',queryItem.btnClass]" v-if="!queryItem.param"  @click="queryBtnClick(form,queryItem)">{{queryItem.label}}</label>
                              </span>
                      </span>
            </div>-->
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import backendService from './remoteService/backendService'
    import validate from './validate/validate'
    import addInput from './addInput'
    import communityChoose from './communityChoose'
    import chooseBtn from './chooseBtn'
    import communityPropertyChoose from './communityPropertyChoose'
    import orderUploadImages from './addImages'

    export default {
        name: 'base-form-creater-new',
        components:{
            'add-input':addInput,
            'choose-btn':chooseBtn ,
            'community-choose':communityChoose ,
            'community-property-choose':communityPropertyChoose,
            'add-images':orderUploadImages
        },
        data(){
            return{
                validate:validate,
                formKey:Math.ceil(Math.random()*10000000),
                rules:{
                },
                ruleForm:{},
                queryElements:[],
                dataQuery:{
                    query:{}
                },
                form:{},
                queryButtons:[],
                readonly:false,
            }
        },
        methods:{
            queryListData(params){
                return backendService.getData({
                    url:params.url,
                    method:params.method||"post",
                    data:params.form
                }).then(function (result) {
                    return Promise.resolve(result)
                })
            },
            changeQueryParam:function (data,operate) {
                    console.log("*********---------->>>>>>changeQueryParam",data,operate,this.rules[data.prop])
                    let casecadeChild=data.casecadeChild;
                    let casecadeGrandsonList=data.casecadeGrandsonList;
                    let cleanMap={};
                    if(casecadeChild){
                        cleanMap[casecadeChild]=casecadeChild;
                    }

                    if(casecadeGrandsonList&&casecadeGrandsonList.length>0){
                        casecadeGrandsonList.forEach(childItem=>{
                            cleanMap[childItem]=childItem;
                        })
                    }
                    let allChildKey=Object.values(cleanMap)
                    let that=this;
                    allChildKey.forEach(cleanKey=>{
                        //console.log("cleanKey",cleanKey)
                        that.$set(that.form,cleanKey,'');
                    })
                    that.queryElements.map(itemElement=>{
                        if(cleanMap[itemElement.prop]){
                            itemElement.defaultValue="";
                            itemElement.value="";
                        }
                        return itemElement;
                    })
                    this.changeHelp(data,operate);
            },
            changeHelp(prop){
                if(prop.type=="select"){
                    let currentSwitchValue=this.form[prop.prop];
                    if(prop.switchElements){
                        let needInitSelected=[].filter.call(prop.switchElements,(item)=>{if(item.whenSwitchValue==currentSwitchValue){ return true;}})[0];
                        //console.log("needInitSelected",needInitSelected)
                        if(needInitSelected){
                            let form=needInitSelected.noNeedAllParams?{}:this.form;
                            if(needInitSelected.otherParam){
                                form=Object.assign(form,needInitSelected.otherParam)
                            }
                            for(let key in needInitSelected.dropProps){
                                delete form[needInitSelected.dropProps[key]];
                            }
                            let item=needInitSelected;
                            if(!item.dataUrl) return;
                            this.queryListData({url:item.dataUrl,form:form,httpMethod:item.httpMethod||"get"}).then((listData)=>{
                                if(!listData) return;
                                this.$set(this.dataQuery.query,item.propList,item.dataHandler?item.dataHandler(listData):listData[item.propValueList])
                                this.form[item.prop]=item.defaultValue;
                                // console.log("**** item",item,this.dataQuery.query)
                            },(error)=>{
                                console.log(error);
                            });
                        }
                    }else if(prop.casecadeChild){
                        let form=prop.noNeedAllParams?{}:this.form;
                        if(prop.casecadeChild.otherParam){
                            form=Object.assign(form,prop.otherParam)
                        }
                        let casecadeChild=this.findCasecadeChild(prop.casecadeChild);
                        if(casecadeChild.extendsProp){
                            if(casecadeChild.extendsProp instanceof Array){
                                for(let seq in casecadeChild.extendsProp){
                                    let key=casecadeChild.extendsProp[seq];
                                    form[key]=currentSwitchValue;
                                }
                            }else{
                                for(let seq in Object.keys(casecadeChild.extendsProp)){
                                    let key=Object.keys(casecadeChild.extendsProp)[seq];
                                    let targetParam=casecadeChild.extendsProp[key];
                                     console.log("key",key,"targetParam",targetParam,this.form[targetParam])
                                    form[key]=this.form[targetParam];
                                }
                            }

                        }
                        let item=casecadeChild;
                        this.queryListData({url:item.dataUrl,form:form,httpMethod:item.httpMethod||"get"}).then((listData)=>{
                            if(!listData) return;
                            let resultData=item.dataHandler?item.dataHandler(listData):listData[item.propValueList];
                            this.$set(this.dataQuery.query,item.propList,resultData)
                            this.form[item.prop]=item.defaultValue;
                            let that=this;
                            if(item.createFormItem){
                                Object.keys(that.form).filter(key=>key.indexOf("temp_"+item.prop+"_")>=0).forEach(deleteKey=>{
                                    //console.log("deleteKey",deleteKey)
                                    delete that.form[deleteKey];
                                })
                                Object.keys(that.rules).filter(key=>key.indexOf("temp_"+item.prop+"_")>=0).forEach(deleteKey=>{
                                    //console.log("deleteRuleKey",deleteKey)
                                    delete that.rules[deleteKey];
                                })
                                resultData.forEach(formItem=>{
                                    formItem.validateProp='temp_'+item.prop+'_'+(formItem.prop||formItem.id);
                                    that.form[formItem.validateProp]=formItem.defaultValue||formItem.default||'';
                                    that.setRules(formItem)
                                })
                            }
                            //console.log("**** casecadeChild",casecadeChild,this.dataQuery.query)
                        },(error)=>{
                            console.log(error);
                        });
                    }
                }else if(prop.type="input"){

                }
            },
            findCasecadeChild(elementKey){
                let result={};
                for(let j=0;j<this.queryElements.length;j++){
                    let item=this.queryElements[j];
                    if(item.prop==elementKey){
                        result=item;
                        break;
                    }

                    if(item.switchElements){
                        for(let i=0;i<item.switchElements.length;i++){
                            let innerItem=item.switchElements[i];
                            if(innerItem.prop == elementKey){
                                result=innerItem;
                            }
                        }
                    }
                }
                return result;
            },
            initQueryElement(){
                /*n 级 级联查询开始*/
                var form=this.form;
                if(this.queryElements==null||this.queryElements.length==0) return;
                var requestUrlParam= [].filter.call(this.queryElements, function (item) {
                    if(item.dataUrl&&item.initQuery){
                        return item;
                    }
                });

                for(let seq in requestUrlParam){
                    let item=requestUrlParam[seq];//选择初始化 默认初始化 顶级父元素 和 标记为包含includeInit 属性的 下拉元素
                    if(item.casecadeParen==null||item.casecadeParen==""||item.includeInit==true){
                        /*顶级元素优先查询完成一级数据初始化*/

                        let form=item.noNeedAllParams?{}:this.form;//参数是否使用表单
                        if(item.otherParam){
                            form=Object.assign(form,item.otherParam)
                        }
                        if(item.extendsProp){
                            if(item.extendsProp instanceof Array){
                                for(let seq in item.extendsProp){
                                    let key=item.extendsProp[seq];
                                    form[key]=this.form[key];
                                }
                            }else{
                                for(let seq in Object.keys(item.extendsProp)){
                                    let key=Object.keys(item.extendsProp)[seq];
                                    let targetParam=item.extendsProp[key];
                                     //console.log("key",key,"targetParam",targetParam)
                                    form[key]=this.form[targetParam];
                                }
                            }
                        }

                        this.queryListData({url:item.dataUrl,form:form,httpMethod:item.httpMethod||"get"}).then((listData)=>{
                            if(!listData) return;
                            this.$set(this.dataQuery.query,item.propList,item.dataHandler?item.dataHandler(listData):listData[item.propValueList])
                            this.form[item.prop]=item.defaultValue;
                            //console.log("****",this.dataQuery.query)
                        },(error)=>{
                            console.log(error);
                        });
                    }
                }
                /*n 级 级联查询结束*/
                this.queryButtons=this.queryElements.filter(item=>{return item.type=='button'||item.type=='search'});
            },
            queryBtnClick(params,btn){
                console.log("queryBtnClick",params);
                if(btn.click&& typeof btn.click=="function"){
                    btn.click(params);
                }else{
                    if(this.$attrs.clickConfig&& typeof this.$attrs.clickConfig=="function"){
                        this.$attrs.clickConfig(params)
                    }
                }
            },
            submitForm(formName) {
                let that=this;
                this.$refs[formName].validate((valid) => {
                   // console.log(this.form)
                    if (valid) {
                        //alert('submit!');
                        let config = this.$attrs.config;
                        let resultData=JSON.parse(JSON.stringify(that.form))
                        if(config.saveData&&typeof config.saveData=="function"){
                            Object.keys(resultData).filter(key=>key.indexOf("temp_")>=0).forEach(targetKey=>{
                                /temp_([a-zA-Z]+)_([a-zA-Z_\d]+)/.exec(targetKey);
                                if(!resultData[RegExp.$1+'_params']){
                                    resultData[RegExp.$1+'_params']={};
                                }
                                resultData[RegExp.$1+'_params'][RegExp.$2]=resultData[targetKey];
                                delete resultData[targetKey];
                                //console.log("targetKey",RegExp.$1,RegExp.$2)

                            })
                            console.log("resultData",resultData)
                            config.saveData(resultData);
                        }
                        /*this.saveData({
                            url:'mall/merchant/create.json',
                            method:'post',
                            queryParam:this.form
                        }).then(success=>{
                            console.log("'mall/merchant/create.json' success",success)
                        },error=>{

                        });*/
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancle(){
                let config = this.$attrs.config;
                if(config.cancle&&typeof config.cancle=="function"){
                    config.cancle(this.form);
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            setRules(item){
                let that=this;
                let validateRules=item.validateRules;//||[{"required":true,maxlength:8,minlength:3}]
                if(validateRules==null||validateRules==""||validateRules==undefined){
                    that.rules[item.validateProp]=[];
                }else{
                    //console.log("typeof validateRules",typeof validateRules)
                    if(typeof validateRules === "string"){
                        validateRules=JSON.parse(validateRules);
                    }
                    if(validateRules.length>0){
                        let errorMessageMap=that.validate.errorMessageMap;
                        let allRuleInOne={}
                        let allErrorInOne={}
                        let itemValidatorFunctions=[];
                        validateRules.forEach(rule=>{
                            if(typeof rule.validator === "function"){
                                itemValidatorFunctions.push(rule);
                            }else{
                                Object.keys(rule).forEach(validateItem=>{
                                    let tipMessage=errorMessageMap[validateItem];
                                    if(typeof tipMessage == "function"){
                                        allErrorInOne[validateItem]=errorMessageMap[validateItem]({label:item.label,length:rule[validateItem]});
                                    }else{
                                        //console.log("***************",rule)
                                        allErrorInOne[validateItem]=errorMessageMap[validateItem];
                                    }
                                })
                                allRuleInOne=Object.assign(allRuleInOne,rule);
                            }
                        })
                        let tempValidator={
                            trigger:'change',
                            allErrorInOne:allErrorInOne,
                            validator:(validator,value,callback)=>{
                                //console.log("addInputList",validator,value)
                                let errorMessage=validate.validator(value,allRuleInOne,that.form);
                                errorMessage.then(data=>{
                                    if(data.code==1){
                                        callback();
                                    }else{
                                        callback(new Error(validator.allErrorInOne&&validator.allErrorInOne[data.errorCode]||data.msg));
                                    }
                                })
                            },
                        }
                        that.rules[item.validateProp||item.prop]=[allRuleInOne["required"]?{required:true,message:allErrorInOne["required"]}:{},...itemValidatorFunctions,tempValidator];
                    }
                }
            },
            saveAppSuccess(response, file, fileList,queryItem){
                // console.log(/*response,file,fileList,*/queryItem)
                let that=this;
                let successUpload=queryItem.imgUploadConfig&&queryItem.imgUploadConfig.successUpload;
                if(successUpload&& typeof successUpload == "function"){
                    let checkResult=successUpload(response,file,queryItem);
                    if(checkResult){
                        if(checkResult instanceof Promise){
                            checkResult.then(success=>{
                                that.form[queryItem.prop] = success.data;
                            },error=>{
                                that.$msgbox(error.msg);
                                //reject({msg:error.msg});
                            })
                        }
                    }
                }else{
                    that.form[queryItem.prop] = response.data.fileUrls[0];
                }
                this.$nextTick(function(){
                    that.loading&&that.loading.close();
                })
            },
            onchangeUpload(data,data2,data3){
                console.log("onchangeUpload",data,data2,data3)
                this.choosedAppIcon=data;
            },
            beforeIconUpload(file,queryItem) {

                let that=this;
                console.log("beforeIconUpload",file,queryItem)
                return new Promise(function (resolve,reject) {
                    //console.log(that.choosedAppIcon)
                    let beforeUpload=queryItem.imgUploadConfig&&queryItem.imgUploadConfig.beforeUpload;
                    if(beforeUpload&& typeof beforeUpload == "function"){
                        let checkResult=beforeUpload(file,queryItem);
                        if(checkResult){
                            if(checkResult instanceof Promise){
                                checkResult.then(success=>{
                                    resolve({code:1,msg:'success'})
                                },error=>{
                                    that.$msgbox(error.msg);
                                    reject({msg:error.msg});
                                })
                            }
                        }
                    }else{
                        if(!(file.type=="image/png"||file.type=="image/jpg"||file.type=="image/jpeg")){
                            that.$message.error('请选择.png/jpg/jpeg图片');
                            reject({msg:"please choose png image"});
                        }
                    }

                    console.log("beforeIconUpload111",file,queryItem)

                    if(that.choosedAppIcon!=null){
                        let choosedImage=that.choosedAppIcon;
                        console.log("beforeIconUpload22",choosedImage)

                        let readResult=new FileReader();
                        readResult.onload=function(data){
                            let fileData=data.target.result;
                            let image=new Image();
                            image.src=fileData;
                            image.onload=data=>{
                                let imageData=data.path&&data.path[0]||data.target;
                                let imageWidth=imageData.width,imageHeight=imageData.height;
                                let beforeUploadImageSize=queryItem.imgUploadConfig&&queryItem.imgUploadConfig.beforeUploadImageSize;
                                if(beforeUploadImageSize&& typeof beforeUploadImageSize == "function"){
                                    let checkResult=beforeUploadImageSize(imageWidth,imageHeight,file,queryItem);
                                    if(checkResult){
                                        if(checkResult instanceof Promise){
                                            return checkResult.then(success=>{
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
                                        }
                                    }
                                }else{
                                    if(!(file.type=="image/png"||file.type=="image/jpg"||file.type=="image/jpeg")){
                                        that.$message.error('请选择.png/jpg/jpeg图片');
                                        reject({msg:"please choose png image"});
                                    }
                                }

                                if(queryItem.imgUploadConfig&&(queryItem.imgUploadConfig.width!=undefined)&&queryItem.imgUploadConfig.height!=undefined&&(imageWidth!=queryItem.imgUploadConfig.width||imageHeight!=queryItem.imgUploadConfig.height)){
                                    let errorMessage='图片大小必须为'+queryItem.imgUploadConfig.width+'px*'+queryItem.imgUploadConfig.height+'px';
                                    that.$msgbox(errorMessage);
                                    reject({msg:errorMessage});
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
                        readResult.readAsDataURL(file);
                    }
                })

            },
            dataBus(props,data){
                //console.log("************",props,data)
                this.form[props.prop]=data&&data.join("||||")||"";
            },
            initPage(param){
                let that=this;
                let config=this.$attrs.config;

                console.log("*****************initPage*******************")

                that.readonly=config.readonly||false;
                this.queryElements=config.queryElements;
                this.queryElements.forEach(item=>{
                    //item.readonly=config.readonly||true;
                    if(item.type=='button'||item.type=='search'){

                    }else if(item.type=='composite'){
                        item.components.forEach(component=>{
                            that.$set(that.form,component.prop,component.default||component.defaultValue||'');
                            that.setRules(component);
                        })
                    }else{
                        that.$set(that.form,item.prop,item.default||item.defaultValue||'');
                        that.setRules(item);
                        if(item.switchElements&& item.switchElements instanceof  Array){
                            item.switchElements.forEach(i=>{
                                that.$set(that.form,i.prop,i.default||'');
                                that.setRules(i);
                            })
                        }
                    }
                    if(item.dataBus){
                        item.dataBus=that.dataBus;
                        // that.$set(that.form,item.propsList,item.default||'');
                    }
                });
                this.initQueryElement();
                let formData=config.formData;
                if(formData){
                    Object.keys(formData).forEach(key=>{
                        that.$set(that.form,key,formData[key]);
                    })
                }
            }
        },
        created() {
            let that=this;
            that.initPage();

            this.$watch("$attrs.config.queryElements",function (newValue,oldValue) {
                that.initPage();
            },{
                deep:false
            })

            this.$watch("$attrs.config.formData",function (newValue,oldValue) {
                if(newValue){
                    Object.keys(newValue).forEach(key=>{
                        that.$set(that.form,key,newValue[key]);
                    })
                }
            },{
                deep:true
            })
        }
    }
</script>
