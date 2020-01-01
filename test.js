// 发布订阅者模式
var Event = function() {
    this.obj = {};
};

Event.prototype.on = function(eventType, fn) {
    if (!this.obj[eventType]) {
        this.obj[eventType] = [];
    }
    this.obj[eventType].push(fn);
};

Event.prototype.emit = function(...arguments) {
    // arguments是类数组对象，不可直接使用数组方法，下面使arguments使用shift方法
    var eventType = Array.prototype.shift.call(arguments);

    var arr = this.obj[eventType];
    for (let i = 0; i < arr.length; i++) {
        // arguments上一步骤已经去除了第一个元素，剩下后面的元素,调用所对应的方法
        arr[i].apply(arr[i], arguments);
    }
};

var eventInstance = new Event();
// 先订阅eat这个事件

eventInstance.on("eat", function(name) {
    console.log("Wash your hands before eating");
});
eventInstance.on("eat", function(name) {
    console.log(name + " is eating.");
});

// 在必要的地方发布eat这个事件
eventInstance.emit("eat", "xiaoming"); // Wash your hands before eating, xiaoming is eating.
