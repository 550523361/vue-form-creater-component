import ChooseBtn from "./chooseBtn"
import CommunityChoose from "./communityChoose"
import CommunityPropertyChoose from "./communityPropertyChoose"
import TableComponentConfig from 'vue-table-creater-component'
import FormCreater from "./baseFormCreaterNew"
import BaseService from "./remoteService/backendService"
import addInput from "./addInput"
import validate from "./validate/validate"
import elementUi from "element-ui"

const TableListConfig=TableComponentConfig.TableListConfig;
const TableList=TableComponentConfig.TableList;
const components=[addInput,FormCreater,ChooseBtn,CommunityChoose,CommunityPropertyChoose];

const install = function(Vue,options){
    Vue.use(elementUi);
    Vue.use(TableComponentConfig);
    components.forEach(component=>{
        Vue.component(component.name,component)
    })
}

let exports={ChooseBtn,TableList,TableListConfig,BaseService,addInput,install,FormCreater};

export default exports;
