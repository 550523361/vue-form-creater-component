<template>
    <div :class="{readonlyContainer:readonly}">
        <div class="searchContainer" >
            <div class="elementsContainer">
                <el-form ref="form" :model="form" :rules="rules" label-width="180px">
              <span class="queryElement" :class="{
                      hidden:queryItem.type=='hidden',
                      switchElementContainer:queryItem.switchElements,
                      tabContainer:queryItem.type=='tab',
                      composite:queryItem.type=='composite',
                      tableClass:queryItem.type=='communityChoose',
                      switchContainer:queryItem.switchElements,
                      switchElement:queryItem.switchElements
                    }" v-for="queryItem in queryElements" :key="queryItem.prop+'_'+queryItem.label">
                    <template  v-if="queryItem.type=='input'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  >
                        <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                          <el-col :span="8">
                            <el-input v-model="form[queryItem.prop]" :disabled="queryItem.readonly||readonly" :placeholder="queryItem.placeholder"></el-input>
                            <div style="color: #f00;font-size: 12px;line-height: 20px;">
                                {{queryItem.tip}}
                            </div>
                          </el-col>
                        </el-form-item>
                    </template>
                    <template  v-if="queryItem.type=='date'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  >
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                          <el-date-picker type="date" :placeholder="queryItem.placeholder" v-model="form[queryItem.prop]" ></el-date-picker>
                        </el-form-item>
                    </template>
                    <template  v-if="queryItem.type=='upload'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  >
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                          <img :src="form[queryItem.prop]" style="width: 100px;height: 100px;vertical-align: middle;" alt="">
                          <el-upload
                                  class="upload-demo"
                                  name="file"
                                  :show-file-list="false"
                                  action="/api-backend/fileUpload.json"
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
                    <template  v-if="queryItem.type=='addInput'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  > 
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                            <add-input :config="queryItem"></add-input> 
                            <span style="display: none"> 
                                <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                            </span> 
                        </el-form-item> 
                    </template> 
                    <template  v-if="queryItem.type=='chooseBtn'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  :style="{'margin-top':'10px','padding-right': '10px',width:queryItem.width||'100%',display: 'inline-block'}"> 
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                            <choose-btn :config="queryItem" :readData="form"></choose-btn> 
                            <span style="display: none"> 
                                <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                            </span> 
                        </el-form-item> 
                    </template>
                    <template  v-if="queryItem.type=='communityChoose'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  :style="{'margin-top':'10px','padding-right': '10px',width:queryItem.width||'100%',display: 'inline-block'}"> 
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                            <community-choose :config="queryItem" :readData="form"></community-choose> 
                            <span style="display: none"> 
                                <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                            </span> 
                        </el-form-item> 
                    </template>
                    <template  v-if="queryItem.type=='communityPropertyChoose'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"   :style="{'margin-top':'10px','padding-right': '10px',width:queryItem.width||'100%',display: 'inline-block'}"> 
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                            <community-property-choose :config="queryItem" :readData="form"></community-property-choose> 
                            <span style="display: none"> 
                                <el-input v-model="form[queryItem.prop]" hidden :placeholder="queryItem.placeholder"></el-input> 
                            </span> 
                        </el-form-item> 
                    </template>
                    <template  v-if="queryItem.type=='switchBtn'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)"  >
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label">
                          <el-switch :placeholder="queryItem.placeholder" v-model="form[queryItem.prop]"></el-switch>
                        </el-form-item>
                    </template>
                    <template  v-if="queryItem.type=='composite'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)">
                        <el-form-item v-for="(component,index) in queryItem.components"  :label="index==0?queryItem.label:''" :prop="component.prop" :key="component.prop+'_'+component.label">
                            <el-input type="text"  v-model="form[component.prop]" :placeholder="component.placeholder"></el-input>
                            <span v-if="index==0" style="display: inline-block;padding:0px 10px;">{{queryItem.link}}</span>
                        </el-form-item>
                    </template>
                    <template  v-if="queryItem.type=='checkbox'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)">
                        <span v-if="!queryItem.dataUrl">
                          <el-form-item :label="queryItem.label" :prop="queryItem.prop" >
                            <el-checkbox-group v-model="form[queryItem.prop]"  >
                              <el-checkbox v-for="item in queryItem.items" :label="item.code"  :key="item.code+item.value+item.id+'_checkbox'+item.label">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                          </el-form-item>
                        </span>
                        <span v-if="queryItem.dataUrl">
                          <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                            <el-checkbox-group v-model="form[queryItem.prop]">
                              <el-checkbox-button v-for="item in dataQuery.query[queryItem.propList]" :key="item.code+item.value+item.id+'_checkbox'+item.label" :label="item.label" :name="queryItem.prop+'checkbox'"></el-checkbox-button>
                            </el-checkbox-group>
                          </el-form-item>
                        </span>
                    </template>
                    <template  v-if="queryItem.type=='radio'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)">
                        <template v-if="!queryItem.dataUrl">
                          <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                            <el-radio-group v-model="form[queryItem.prop]" :size="queryItem.items.length+''">
                              <el-radio border v-for="item in queryItem.items" :label="item.code" :name="queryItem.prop+'checkbox'" :key="item.code+item.value+item.id+'_radio'+item.label">{{item.label}}</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </template>
                        <template v-if="queryItem.dataUrl">
                          <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                            <el-radio-group v-model="form[queryItem.prop]">
                              <el-radio border v-for="item in dataQuery.query[queryItem.propList]" :label="item.code" :name="queryItem.prop+'checkbox'" :key="item.code+item.value+item.id+'_radio'+item.label">{{item.label}}</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </template>
                    </template>
                    <template  v-if="queryItem.type=='select'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)">
                        <template v-if="!queryItem.dataUrl">
                          <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                            <el-select v-model="form[queryItem.prop]" :placeholder="queryItem.defaultLabel" :disabled="queryItem.readonly||readonly" @change="changeQueryParam(queryItem)">
                              <el-option :label="queryItem.defaultLabel||'请选择'" :value="queryItem.defaultValue||''"></el-option>
                              <el-option  v-for="component in queryItem.options" :value="component.value||component.code||component.id" :label="component.label||component.name" :key="component.code+component.value+component.id+'_select'+component.label"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                        <template v-if="queryItem.dataUrl">
                          <el-form-item :label="queryItem.label" :prop="queryItem.prop">
                            <el-select v-model="form[queryItem.prop]" :placeholder="queryItem.defaultLabel" :disabled="queryItem.readonly||readonly" @change="changeQueryParam(queryItem)">
                              <el-option :label="queryItem.defaultLabel||'请选择'" :value="queryItem.defaultValue||''"></el-option>
                              <el-option  v-for="component in dataQuery.query[queryItem.propList]" :value="component.value||component.code||component.id" :label="component.label" :key="component.code+component.value+component.id+'_select'+component.label"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                        <!--被开关元素控制的元素集合-->
                        <span v-if="queryItem.switchElements" v-for="queryItemInner in queryItem.switchElements" :key="queryItemInner.prop+'_switch'+queryItemInner.label">
                                    <template  v-if="queryItemInner.type=='input'&&form[queryItem.prop]==queryItemInner.whenSwitchValue" >
                                        <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop">
                                          <el-col :span="8">
                                            <el-input v-model="form[queryItemInner.prop]" :placeholder="queryItemInner.placeholder"></el-input>
                                          </el-col>
                                        </el-form-item>
                                    </template>
                                    <template  v-if="queryItemInner.type=='date'&&form[queryItem.prop]==queryItemInner.whenSwitchValue"  >
                                        <el-form-item :prop="queryItemInner.prop" :label="queryItemInner.label">
                                          <el-date-picker type="date" :placeholder="queryItemInner.placeholder" v-model="form[queryItemInner.prop]" ></el-date-picker>
                                        </el-form-item>
                                    </template>
                                    <template  v-if="queryItemInner.type=='switchBtn'&&form[queryItem.prop]==queryItemInner.whenSwitchValue"  >
                                        <el-form-item :prop="queryItemInner.prop" :label="queryItemInner.label">
                                          <el-switch :placeholder="queryItemInner.placeholder" v-model="form[queryItemInner.prop]"></el-switch>
                                        </el-form-item>
                                    </template>
                                    <template  v-if="queryItemInner.type=='composite'&&form[queryItem.prop]==queryItemInner.whenSwitchValue"  >
                                        {{queryItemInner.label}}:
                                        <span  v-for="component in queryItemInner.components">
                                            <input type="text" class="form-control width170" v-model="form[component.prop]" :placeholder="component.placeholder"
                                                   :id="component.id" :maxelementid="component.maxelementid" :minelementid="component.minelementid"
                                            >
                                                    <span v-if="$index==0">{{queryItemInner.link}}</span>
                                         </span>
                                    </template>
                                    <template  v-if="queryItemInner.type=='checkbox'&&form[queryItem.prop]==queryItemInner.whenSwitchValue" :class="{switchContainer:queryItemInner.switchElements}" >
                                        <span v-if="!queryItemInner.dataUrl">
                                          <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop" >
                                            <el-checkbox-group v-model="form[queryItemInner.prop]"  >
                                              <el-checkbox v-for="item in queryItemInner.items" :label="item.label" :key="item.code+item.value+item.id+'_inner_checkbox'+item.label"></el-checkbox>
                                            </el-checkbox-group>
                                          </el-form-item>
                                        </span>
                                        <span v-if="queryItemInner.dataUrl">
                                          <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop">
                                            <el-checkbox-group v-model="form[queryItemInner.prop]">
                                              <el-checkbox-button v-for="item in dataQuery.query[queryItemInner.propList]" :label="item.label" :name="queryItemInner.prop+'checkbox'" :key="item.code+item.value+item.id+'_inner_checkbox'+item.label"></el-checkbox-button>
                                            </el-checkbox-group>
                                          </el-form-item>
                                        </span>
                                    </template>
                                    <template  v-if="queryItemInner.type=='radio'&&form[queryItem.prop]==queryItemInner.whenSwitchValue" :class="{switchContainer:queryItemInner.switchElements}" >
                                        <template v-if="!queryItemInner.dataUrl">
                                          <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop">
                                            <el-radio-group v-model="form[queryItemInner.prop]" :size="queryItemInner.items.length+''">
                                              <el-radio border v-for="item in queryItemInner.items" :label="item.label" :name="queryItemInner.prop+'checkbox'" :key="item.code+item.value+item.id+'_inner_radio'+item.label"></el-radio>
                                            </el-radio-group>
                                          </el-form-item>
                                        </template>
                                        <template v-if="queryItemInner.dataUrl">
                                          <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop">
                                            <el-radio-group v-model="form[queryItemInner.prop]">
                                              <el-radio border v-for="item in dataQuery.query[queryItemInner.propList]" :label="item.label" :name="queryItemInner.prop+'checkbox'" :key="item.code+item.value+item.id+'_inner_radio'+item.label"></el-radio>
                                            </el-radio-group>
                                          </el-form-item>
                                        </template>
                                    </template>
                                    <template  v-if="queryItemInner.type=='select'&&form[queryItem.prop]==queryItemInner.whenSwitchValue"  >
                                            <template v-if="queryItemInner.createFormItem">
                                                <template v-if="queryItemInner.dataUrl">
                                                  <el-form-item :label="tempFormItem.label" :prop="'temp_'+queryItemInner.prop+'_'+(tempFormItem.prop||tempFormItem.id)" :key="'temp_'+ItemInnerIndex+'_'+queryItemInner.prop+'_'+(tempFormItem.prop||tempFormItem.id)" v-for="(tempFormItem,ItemInnerIndex) in dataQuery.query[queryItemInner.propList]">
                                                      <el-col :span="8">
                                                          <el-input v-model="form['temp_'+queryItemInner.prop+'_'+(tempFormItem.prop||tempFormItem.id)]" :placeholder="tempFormItem.defaultLabel"></el-input>
                                                      </el-col>
                                                      <el-col :span="8">
                                                          <span class="tipMessage">{{tempFormItem.tip}}</span>
                                                      </el-col>
                                                  </el-form-item>
                                                </template>
                                            </template>
                                            <template v-else="queryItemInner.createFormItem">
                                                <template v-if="!queryItemInner.dataUrl">
                                                  <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop">
                                                    <el-select v-model="form[queryItemInner.prop]" :placeholder="queryItemInner.defaultLabel" @change="changeQueryParam(queryItemInner)">
                                                      <el-option :label="queryItemInner.defaultLabel||'请选择'" :value="queryItemInner.defaultValue||''"></el-option>
                                                      <el-option  v-for="(component,queryItemInnerIndex) in queryItemInner.options" :value="component.value||component.code||component.id" :key="'_key_'+queryItemInnerIndex+'_'+component.value||component.code||component.id" :label="component.label||component.name"></el-option>
                                                    </el-select>
                                                  </el-form-item>
                                                </template>
                                                <template v-if="queryItemInner.dataUrl">
                                                  <el-form-item :label="queryItemInner.label" :prop="queryItemInner.prop">
                                                    <el-select v-model="form[queryItemInner.prop]" :placeholder="queryItemInner.defaultLabel" @change="changeQueryParam(queryItemInner)">
                                                      <el-option :label="queryItemInner.defaultLabel||'请选择'" :value="queryItemInner.defaultValue||''"></el-option>
                                                      <el-option  v-for="component in dataQuery.query[queryItemInner.propList]" :key="queryItemInner.prop+'_'+component.id" :value="component.value" :label="component.label||component.name"></el-option>
                                                    </el-select>
                                                  </el-form-item>
                                                </template>
                                            </template>
                                    </template>
                                    <template  v-if="queryItem.type=='datetimerange'">
                                            {{queryItem.label}}
                                            <el-date-picker
                                                    v-model="form[queryItemInner.prop]"
                                                    type="datetimerange"
                                                    :picker-options="queryItemInner.options"
                                                    :range-separator="queryItemInner.centerLabel||'至'"
                                                    :placeholder="queryItemInner.placeholder||'请选择时间范围'"
                                                    format="yyyy-MM-dd hh:mm:ss"
                                                    align="right">
                                            </el-date-picker>
                                    </template>
                        </span>
                    </template>
                    <template  v-if="queryItem.type=='datetimerange'&&(queryItem.watch&&queryItem.watch.prop?form[queryItem.watch.prop]==queryItem.watch.watchValue:true)">
                        <el-form-item :prop="queryItem.prop" :label="queryItem.label"> 
                            <el-date-picker
                                    v-model="form[queryItem.prop]"
                                    type="datetimerange"
                                    :picker-options="queryItem.options"
                                    :range-separator="queryItem.centerLabel||'至'"
                                    :placeholder="queryItem.placeholder||'请选择时间范围'"
                                    format="yyyy-MM-dd hh:mm:ss"
                                    align="right">
                            </el-date-picker>
                        </el-form-item> 
                    </template>
              </span>
                    <el-form-item>
                        <el-button type="primary" v-if="!readonly" @click="submitForm('form')">立即{{form["id"]?"更新":'创建'}}</el-button>
                        <!--<el-button @click="resetForm('form')">重置</el-button>-->
                        <el-button @click="cancle">取消</el-button>
                    </el-form-item>
                </el-form>
                {{form}}
                <hr>
                {{rules}}
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
    import backendService from './remoteService/backendService'
    import validate from './validate/validate'
    import addInput from './addInput'
    import communityChoose from './communityChoose'
    import chooseBtn from './chooseBtn'
    import communityPropertyChoose from './communityPropertyChoose'


    let queryElements=[
        /*{
            type:'radio',
            prop:"state",
            value:"1",
            label:'店铺状态',
            items:[
                {
                    label:'第一步',
                    value:'0'
                },
                {
                    label:'第二步',
                    value:'1'
                },
            ]
        },*/
        {
            label:'店铺名称',
            type:'input',
            placeholder:'店铺名称',
            prop:'name',
        },
        {
            label:'经营范围',
            type:'input',
            placeholder:'经营范围 选择小区',
            prop:'communityIds'
        },
        {
            label:'店铺简介',
            type:'input',
            placeholder:'店铺简介',
            prop:'summary'
        },
        {
            label:'店铺首图',
            type:'upload',
            placeholder:'店铺首图',
            tip:'尺寸要求:1280px*800px,格式为jpg,jpeg,png文件上传较大时，请耐心等待',
            prop:'picUrl'
        },
        {
            label:'售后电话',
            type:'input',
            placeholder:'店铺首图',
            prop:'phone'
        },

        /*{
            type:'input',
            prop:"account",
            value:"1",
            label:'店铺登录账户',
            placeholder:'请输入店铺登录账号',
        },*/
        /*{
            type:'switchBtn',
            prop:"switchBtn",
            value:"1",
            label:'开关按钮',
            validateRules:[

            ]
        },*/
        /*{
            type:'hidden',
            prop:"lunaibaos",
            value:"1",
            label:'乱七八糟',
            items:[
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
            ]
        },
        {
            type:'hidden',
            prop:"upShelvescc",
            label:'复选框啊',
            value:"1",
            items:[
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
                {
                    label:"A"+Math.ceil(Math.random()*1000),
                    name:'B'+Math.ceil(Math.random()*1000),
                    id:Math.ceil(Math.random()*1000)
                },
            ]
        },

        {
            label:'商品名称',
            type:'hidden',
            placeholder:'商品名称',
            prop:'name',
            validateRules:[
                { required: true, message: '不能为空', trigger: 'change' },
                {
                    validator:(validator,value,callback)=>{
                        let errorMessage=validate.validator(value,{required:true,number:"##",minvalue:0,maxvalue:99});
                            errorMessage.then(data=>{
                                if(data.code==1){
                                    callback();
                                }else{
                                    callback(new Error(data.msg));
                                }
                            })
                    },
                    tr
   r:"change"
                }
            ]
        },*/
        /*{
            label:'商品类型',
            placeholder:'请选择商品类型',
            defaultValue:"",
            type:'select',
            casecadeChild:'',
            switchElements:[
                {
                    whenSwitchValue:'1',
                    label:'电商商品分类',
                    initQuery:false,
                    defaultValue:"",
                    type:'select',
                    placeholder:'请选择',
                    dataUrl:'/function/appApplySort/queryListPage.json',
                    prop:'categoryId',
                    propList:'categoryList',
                    propKeyList:'categoryList',
                    propValueList:'categoryList',
                    casecadeParen:"",
                    noNeedAllParams:true,
                    dataHandler:item=>{
                        item.data.content.map(i=>{
                            i.code=i.id;
                            i.value=i.id;
                            i.label=i.title;
                            i.name=i.title;
                            return i;
                        })
                        return item.data.content;
                    },
                    dropProps:["pid"],
                    otherParam:{
                        pageNum: 1,
                        pageSize: 10,
                        state: "",
                        title: "",
                    },
                    casecadeChild:"",
                    casecadeGrandsonList:[""]
                },
                {
                    whenSwitchValue:'2',
                    type:'select',
                    label:'服务分类',
                    initQuery:false,
                    defaultValue:"",
                    placeholder:'请选择',
                    dataUrl:'mall/goods/queryCategoryList.json?type=2&',
                    prop:'pid',
                    propList:'categoryList',
                    propKeyList:'categoryList',
                    propValueList:'categoryList',
                    casecadeParen:"",
                    casecadeChild:"categorySubId",
                    casecadeGrandsonList:["categoryId"]
                },
                {
                    whenSwitchValue:'2',
                    type:'select',
                    label:'二级分类',
                    defaultValue:"",
                    placeholder:'请选择',
                    initQuery:false,
                    dataUrl:'mall/goods/queryCategoryList.json?type=2&',
                    prop:'categorySubId',
                    propList:'categorySubList',
                    propKeyList:'categorySubList',
                    propValueList:'categoryList',
                    casecadeParen:"categoryId",
                    casecadeChild:"",
                    casecadeGrandsonList:[]
                }
            ],
            options:[
                {label:'电商',value:'1'},
                {label:'服务',value:'2'},
            ],
            prop:'goodsType'
        },*/
        /*{
            label:'搜索',
            type:'search',
            check: function (form) {
                console.log("formformform",form);
                if(form){
                    var communityName=form.communityName||"";
                    communityName=communityName.replace(/^\s+/,"").replace(/\s+$/,"");
                    if(communityName==""){
                        return true;
                    }

                }
                return true;
            }
        }   ,
        {
            label:'tabs',
            type:'tab',
            default:1,
            components:[
                {
                    label:'完成',
                    prop:'state',
                    name:'radioBtn',
                    value:1
                },
                {
                    label:'结束',
                    prop:'state',
                    name:'radioBtn',
                    value:2
                },
                {
                    label:'所有',
                    prop:'state',
                    name:'radioBtn',
                    value:3
                }

            ],
            check: function (form) {
                console.log("formformform",form);
                if(form){
                    var communityName=form.communityName||"";
                    communityName=communityName.replace(/^\s+/,"").replace(/\s+$/,"");
                    if(communityName==""){
                        return true;
                    }

                }
                return true;
            }
        }   ,
        {
            label:'批量下架',
            type:'button',
            param:true,
            click: function (data,list) {
                let checkList=[].filter.call(list||[],(item)=>{return item.checked;})
                console.log(data,checkList);
            }
        },
        {
            label:'导出',
            type:'button',
            param:true,
            click: function (form,dataList) {
                console.log(form,dataList);
            }
        },
        {
            label:'搜索',
            type:'button',
            param:true
        },*/
        /*{
            label:'日期',
            type:'date',
            param:true
        }*/
    ];

    export default {
        name: 'form-creater',
        components:{
            'add-input':addInput,
            'choose-btn':chooseBtn ,
            'community-choose':communityChoose ,
            'community-property-choose':communityPropertyChoose
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
                //console.log("changeQueryParam",data,operate,this.rules[data.prop])
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
                                    // console.log("key",key,"targetParam",targetParam)
                                    form[key]=form[targetParam];
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
                    let item=requestUrlParam[seq];
                    if(item.casecadeParen==null||item.casecadeParen==""){
                        /*顶级元素优先查询完成一级数据初始化*/
                        this.queryListData({url:item.dataUrl,form:this.form,httpMethod:item.httpMethod||"get"}).then((listData)=>{
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
                    that.loading.close();
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
            }
        },
        created() {
            let that=this;
            let config=this.$attrs.config||{};

            that.readonly=config.readonly||false;

            this.queryElements=config.queryElements||queryElements;
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
    }
</script>