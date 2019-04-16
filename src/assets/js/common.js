 export default{
 tabLeft(){
            var left = $('.page-tabs').offset().left; 
             console.log(left);
            //tab宽度
            var tabW = $('.page-tabs').width();
            //总宽度
            var contentW = $('.content-tabs').width()-240;
            if(tabW> contentW){
                $('.page-tabs').offset({
                    left: left - 110
                });
            }
            
        },
       
}