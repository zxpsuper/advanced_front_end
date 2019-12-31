class Dog {
    constructor() {
        this.name = "Dog";
    }
    eat() {
        console.log(this.name + " is eating");
    }
}

class Cat {
    constructor() {
        this.name = "Cat";
    }
    eat() {
        console.log(this.name + " is eating");
    }
}

function putOnWings(animal) {
    animal.prototype.fly = function() {
        console.log(this.name + " is flying");
    };
    return new animal();
}

let dog = putOnWings(Dog);

dog.fly();
let cat = putOnWings(Cat);
cat.fly();
cat.eat();
