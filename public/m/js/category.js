$(function(){
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        indicators: false
    });
    //获取数据
    
    $.ajax({
        url:"/category/queryTopCategory",
        success:function(obj){
            // console.log(obj);
            var html = template('categoryLeftTpl',obj)
            $('.category-left ul').html(html);
        }
    })

    querySecondCategory(1);

    // 注册点击事件
    $('.category-left ul').on('tap','li a',function(){
        // 获取这个点击的id
        var id = $(this).data('id')
        querySecondCategory(id)

        // 排他思想更改样式
        $(this).parent().addClass('active').siblings().removeClass('active');
    })
    
    //封装一个ajax请求
    function querySecondCategory (id){
        $.ajax({
            url:"/category/querySecondCategory",
            data:{id:id},
            success:function(obj){
                console.log(obj);
                
                var html = template('categoryRightTpl',obj);
                $('.category-right ul').html(html);
            }
        })
    }
    
})