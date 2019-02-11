<template>
    <div class="mainViewContainer">
         <span v-html="photoListHtml" class="imageListContainer"></span>
    </div>
</template>
<script>
    export default {
        name: 'display-images',
        data(){
            return{
                config:{
                    readonly:false,
                },
                photoListHtml:''
            }
        },
        methods:{

            init(){
                let config=this.$attrs.config;
                this.config=config;
                let photos=this.config.photos;
                if(!photos) return '模板无内容';
                let photoNum=photos.length;
                let containerWidth=160*1;
                let photoWidth=160;
                let lines=Math.ceil(Math.sqrt(photoNum));
                lines=lines>3?3:lines;
                if(photoNum>1){
                    photoWidth=Math.ceil((containerWidth-lines*2)/lines);
                }
                this.photoListHtml=JSON.parse(JSON.stringify(photos)).map((url,index)=>{
                    return `<span style="
                                background:url(${url}) center center no-repeat;
                                background-size: contain;
                                display:inline-block;
                                width:${photoWidth}px;
                                height:${Math.ceil(photoWidth/1280*800)}px;
                                border: 1px solid #666;
                                box-sizing: border-box;
                                margin-right: ${(index+1)%lines==0?0:2}px;
                                line-height: normal;
                                border-radius: 3px;
                                margin-bottom: 2px;
                            "></span>`
                }).join("");
            }
        },
        created() {
        },
        mounted(){
            this.$watch("$attrs.config",function (newData,oldData) {
                console.log("************888888newData,oldData",newData)
                this.init();
            },{
                deep:true
            })
            this.init();
        }
    }
</script>

<style scoped>
     .imageListContainer{
         width: 160px;
         display: flex;
         flex-direction: row;
         flex-wrap: wrap;
         align-items: center;
         justify-content: flex-start;
     }
    .imageListContainer > span{
        margin-bottom: 2px;
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
