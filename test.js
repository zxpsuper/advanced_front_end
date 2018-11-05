var bingShop={
    clienlist: {}, //缓存列表
    on: function (key, fn) { //增加订阅者
        if(!this.clienlist[key]){
            this.clienlist[key] = [];
        }
        this.clienlist[key].push(fn);
    },
    emit: function () { //发布消息
        var key = [].shift.call(arguments),//取出消息类型
            fns = this.clienlist[key];//取出该类型的对应的消息集合
        if(!fns || fns.length===0){
            return false;
        }
        for(var i=0, fn; fn = fns[i++];){
            fn.apply(this,arguments);
        }
    },
    remove: function (key, fn) {
        var fns=this.clienlist[key]; //取出该类型的对应的消息集合
        if (!fns) { //如果对应的key没有订阅直接返回
            return false;
        }
        if (!fn) {//如果没有传入具体的回掉，则表示需要取消所有订阅
            fns && (fns.length = 0);
        } else{
            for (var l = fns.length-1; l >= 0; l--){//遍历回掉函数列表
                if(fn === fns[l]){
                    fns.splice(l,1);//删除订阅者的回掉
                }
            }
        }
    }
}

/*小明发布订阅*/
bingShop.on('红烧肉', fn1 = function (price, taste) {
    console.log("小明, 你要的" + price+ "元，" + taste + "味道的烧饼已经到货啦");
});
/*小龙发布订阅*/
bingShop.on('叉烧肉', function (price, taste){
    console.log("小龙, 你要的" + price + "元，" + taste + "味道的烧饼已经到货啦");
});        

bingShop.emit("红烧肉", 10, "红烧肉");
bingShop.emit("叉烧肉", 12, "叉烧肉");
bingShop.remove('红烧肉');
bingShop.emit("红烧肉", 10, "红烧肉");