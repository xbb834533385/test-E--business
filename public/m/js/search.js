$(function(){

    // 点击搜索，把当前input里的值存储到本地数据中
    $('.btn-search').on('tap',function(){
        // 获取input里的内容
        var search = $('.input-search').val();
        // 判断里面开头和结尾是否为空格
            // .trim()把首位空格去掉
        if(!search.trim()){
            alert('请输入有效的搜索');
            return;
        }
        // 获取之前的储存搜索记录的localStorage
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 判断搜索的这个值在之前是否已经存在，如果存在则删除这个值，然后重新添加到最前面
        // indexOf() 返回值如果存在返回下标，如果不存在就返回-1
        if(historyData.indexOf(search) != -1){
            historyData.splice(historyData.indexOf(search),1)
        }
        historyData.unshift(search);
        localStorage.setItem('searchHistory',JSON.stringify(historyData));
        $('.input-search').val('');
        location = 'productlist.html?html='+search;
    })


    queryHistory();

    //获取本地数据,从localStorage获取
    function queryHistory (){
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 因为要导入模板需要的是对象因此
        historyData = { rows : historyData };
        // 调用模板方法生成html
        var html = template('searchTpl',historyData);
        $('.mui-table-view').html(html);
    }
    // 给每一个x按钮注册事件
    $('.mui-table-view').on('tap','.fa-times',function(){
        // 获取当前x按钮的索引
        var index = $(this).data('index');
        // 获取本地元素的所有数据
        var historyData = JSON.parse(localStorage.getItem('searchHistory')) || [];
        // 删除当前索引的元素
        historyData.splice(index,1);
        // 把删除过的数据重新存贮到localstory中，并重新渲染
        localStorage.setItem('searchHistory',JSON.stringify(historyData));
        queryHistory();
    })
    // 给清空记录按钮注册事件
    $('.clear').on('tap',function(){
        localStorage.removeItem('searchHistory');
        // ****************************你又忘写了
        queryHistory();
    })
    // 给每一个li标签注册事件
    $('.mui-table-view').on('tap','.mui-table-view-cell',function(){
        // $('.input-search').val($(this).text());
    })
})