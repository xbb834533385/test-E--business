$(function(){
    // 当点击登录时发送ajax请求
    $('.btn-login').on('tap',function(){
        // 获取用户名
        var username = $('.username').val().trim();
        var password = $('.password').val().trim();

        // 判断用户名和密码是否合法
        if(!username){
            mui.alert( '请输入用户名', '提示', '确定');
            return false;
        };
        if(!password){
            mui.alert( '请输入密码', '提示', '确定');
            return false;
        };
        // 发送ajax请求
        $.ajax({
            url:'/user/login',
            type:'post',
            data:{username:username,password:password},
            success:function(obj){
                // 判断
                if(!obj.success){
                    mui.alert('用户或密码错误，请重新输入','提示','确定');
                }else{
                    // 登录成功跳转到原来的页面
                    var returnUrl = getQueryString('returnUrl');
                    location = returnUrl;
                }
            }
        })
    });
    // 给注册按钮事件
    $('.btn-register').on('tap',function(){
        location = 'register.html';
    })

    // url取参数封装函数
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