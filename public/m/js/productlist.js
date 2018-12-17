$(function () {
    // 获得地址中的参数
    var search = getQueryString('search');


    queryProduct();

    // 给搜索按钮添加事件
    $('.btn-search').on('tap', function () {
        
        search = $(this).siblings().val();
        if (!search.trim()) {
            alert('请输入合法的内容');
            // 后面代码不执行 阻止默认行为
            return false;
        }
        queryProduct();
    })

    // 封装商品查询事件
    function queryProduct() {
        $.ajax({
            url: '/product/queryProduct',
            data: { page: 1, pageSize: 4, proName: search },
            success: function (obj) {
                // console.log(obj);
                var html = template('productListTpl', obj);
                $('.product-content ul').html(html);
            }
        })
    };

    // 给所有排序的a添加点击事件
    /**
     * 3. 商品排序
		1. 如何排序 调用API传入参数进行排序 如果价格传入price 数量传入num
		2. 排序顺序 price=1升序 从小到大  price=2降序  从大到小
		3. 点击了排序按钮后 如果现在是升序(1) 点击了后变成降序(2)
		4. 在a标签默认存储一个排序顺序 默认1升序
		5. 点击后切换这个排序顺序的属性的值
		6. 还需要知道当前点击a排序方式是price还是num  获取a身上的排序方式
		7. 调用APi传入 传入对应排序方式和排序顺序即可 后面渲染页面
     */

    // 定义全局变量
    var sort = null;
    var sortType = null;
    // var params = null;
    $('.product-title ul li a').on('tap', function () {

        //更改li标签的active属性
        $(this).parent().addClass('active').siblings().removeClass('active');
        // 获取当前点击的sort排序
        sort = $(this).data('sort');
        // 更改当前顺序
        sort = sort == 1 ? 2 : 1;
        if(sort==1){
            $(this).children().attr('class','fa fa-angle-up')
        }else{
            $(this).children().attr('class','fa fa-angle-down')
        }
        // 重新赋值给点击的a标签
        $(this).data('sort', sort);
        // 获得当前点击的a标签是何种排序
        sortType = $(this).data('sort-type');
        // 把这些参数写到一个对象中
        var params = { page: 1, pageSize: 4, proName: search };
        // 把sortType添加到params中
        params[sortType] = sort;
        // 发送ajax请求
        $.ajax({
            url: '/product/queryProduct',
            data: params,
            success: function (obj) {
                var html = template('productListTpl', obj);
                $('.product-content ul').html(html);
            }
        })
    })

    // 给购买按钮添加点击事件
    $('.product-content ul').on('tap','.product-buy',function(){
        // 获取当前点击的id
        var id = $(this).data('id');
        // 跳转
        location = 'detail.html?id='+id;
    })

    /*4. 下拉刷新和上拉加载
    	1. 调用MUI的初始化方法初始化下拉刷新和上拉加载效果
    	2. 指定下拉刷新的回调函数 实现刷新数据
    	3. 调用MUI结束下拉刷新的效果不然会一直转
    	4. 指定上拉加载的回调函数加载更多数据
    	5. 定义一个page当前页码数 每次上拉把page++ 请求下一页数据(更多的数据)
    	6. 把数据渲染后追加到页面 使用append
    	7. 追加完成结束上拉加载效果
    	8. 判断当如果上拉没有数据的时候 要结束上拉并且提示没有数据了 传入一个true
    	9. 但是再次下拉的时候需要能够重新上拉所以下拉完了后要重置上拉加载效果
    	10. 而且page也要从头开始 重置为1
    */
    // 定义一个全局变量page
    var page = 1;
    // 初始化下拉刷新的效果
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50,//可选,默认50.触发下拉刷新拖动距离,
                auto: false,//可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function () {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    setTimeout(function () {
                        queryProduct();
                        //结束刷新效果
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                        // 下拉完成后 重置这个上拉加载的效果
                        mui('#refreshContainer').pullRefresh().refresh(true);
                        //  把page也要重置为1
                        page = 1;
                    }, 1000)
                }
            },
            up: {
                height: 50,//可选.默认50.触发上拉加载拖动距离
                auto: false,//可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function () {//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    setTimeout(function () {
                        page++;
                        var params = { page: page, pageSize: 4, proName: search };
                        // 把sortType添加到params中
                        if(sort){
                            params[sortType] = sort;
                        }
                        
                        $.ajax({
                            url: '/product/queryProduct',
                            data: params,
                            success: function (obj) {
                                console.log(obj);
                                // 判断有没有数据，如果有就添加到ul里
                                if(obj.data.length){
                                    var html = template('productListTpl',obj);
                                    $('.product-content ul').append(html);
                                    // 结束下拉效果
                                	mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                                }else{
                                    // 没有长度提示没有数据 了 endPullupToRefresh提示没有数据传人一个true
                                	mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                }
                                
                            }
                        })
                    }, 1000)
                }
            }
        }
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