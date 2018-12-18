$(function () {


    // 获取网页的id
    var id = getQueryString('id');

    // 获取数据
    $.ajax({
        url: '/product/queryProductDetail',
        data: { id: id },


        success: function (obj) {
            
            // 对尺码进行处理
            var min = obj.size.split('-')[0] - 0;
            var max = obj.size.split('-')[1];
            // console.log(min+max);
            // 把obj的size重新赋值
            obj.size = [];
            for (var i = min; i <= max; i++) {
                obj.size.push(i);
            }
            console.log(obj);
            var html = template('slidTpl', obj);
            $('.mui-scroll').html(html);
            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 1000//自动轮播周期，若为0则不自动播放，默认为0；
            });
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                indicators: false
            });
            // 数字框初始化
            mui('.mui-numbox').numbox();
            // 给尺码添加点击事件
            $('.btn-size').on('tap',function(){
                $(this).addClass('active').siblings().removeClass('active');
            })
        }
    })
    // 给添加购物车注册事件
    $('.btn-buycar').on('tap',function(){
        // 获取当前尺码，数量的信息
        // var size = $('.btn-size.active').html();
        // console.log(size);
        // 两个的区别一个是字符串，一个是数字
        var size = $('.btn-size.active').data('id');
        // console.log(size);
        if(!size){
            mui.toast('请选择尺码',{ duration:'3000', type:'div' });
            return false; 
        };
        // 获取当前选择的数量
        var num = mui('.mui-numbox').numbox().getValue();
        // mui(Selector).numbox().getValue()
        // console.log(num);
        if(!num){
            mui.toast('请选择数量',{ duration:'3000', type:'div' });
            return false; 
        };
        // 调用ajax加入到数据库中
        $.ajax({
            url:'/cart/addCart',
            type:'post',
            data:{productId:id,num:num,size:size},
            success:function(obj){
                // console.log(obj);
                
                if(obj.success){
                    // 添加成功提示
                    mui.confirm( '是否跳转到购物车', '提示', ['yes','no'], function(e){
                        if(e.index){
                            mui.toast('请继续添加',{duration:1000,type:'div'});
                        }else{
                            location = 'cart.html';
                        }
                    } )
                }else{
                    // 加入失败，跳转到登陆界面
                    location = 'login.html?returnUrl='+location.href;
                }
            }
        })
    });

    // 根据url参数名取值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        // console.log(r);
        if (r != null) {
            //转码方式改成 decodeURI
            return decodeURI(r[2]);
        }
        return null;
    }
})