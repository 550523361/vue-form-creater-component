import BaseFormCreater from "./baseFormCreater"

const components=[BaseFormCreater];

const install =function(Vue,options){
    components.forEach(component=>{
        Vue.component(component.name,components)
    })
}

module.exports={
    FormCreater:BaseFormCreater
}