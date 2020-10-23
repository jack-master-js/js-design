class People {
    constructor(name) {
        this.name = name
    }

    speak(from = '') {
        console.log(`[${from}] my name is ${this.name}`);
    }
}

class Animal {
    constructor(name) {
        this.name = name
    }

    roar(from = '') {
        console.log(`[${from}] ${this.name} is roaring.`);
    }
}

//工厂模式
class Factory {
    produce(type, name) {
        if(type === 'People') return new People(name)
        if(type === 'Animal') return new Animal(name)
    }
}

const factory = new Factory()
const people = factory.produce('People', 'paddy')
people.speak('Factory')
const animal = factory.produce('Animal', 'wolf')
animal.roar('Factory')

//外观模式
class Interface {
    makeSound(target, from) {
        if(target.speak) return target.speak(from)
        if(target.roar) return target.roar(from)
    }
}

const interface = new Interface()
interface.makeSound(people, 'Interface')
interface.makeSound(animal, 'Interface')

//单例模式
const WORLD = {}
WORLD.creature = {
    people: people,
    animal: animal,
}

WORLD.creature.people.speak('WORLD')
WORLD.creature.animal.roar('WORLD')

//命令模式
class Commander {
    speak(from) {
        people.speak(from)
    }

    roar(from) {
        animal.roar(from)
    }

    execute(cmd,from) {
        return this[cmd](from)
    }
}

const commander = new Commander()
commander.execute('speak', 'Commander')
commander.execute('roar', 'Commander')

//策略模式
class Validator {
    constructor(types, rules) {
        this.types = types
        this.rules = rules
    }
    validate(data) {
        for (const key in data) {
            let type = this.rules[key]
            let checker = this.types[type]
            checker.say(data[key])
        }
    }
}
const types = {
    isPeople: {
        say: (from) => people.speak(from)
    },
    isAnimal: {
        say: (from) => animal.roar(from)
    }
}
const rules = {
    a: 'isPeople',
    b: 'isAnimal',
}
const data = {
    a: 'Validator',
    b: 'Validator',
}

const validator = new Validator(types, rules)
validator.validate(data)

//代理模式
class Proxy {
    say(from) {
        people.speak(from)
        animal.roar(from)
    }
}

const proxy = new Proxy()
proxy.say('Proxy')

//模板模式
class Father {
    speak(){}
    roar(){}
    say(from) {
        this.speak(from)
        this.roar(from)
    }
}
class Child extends Father {
    speak(from){
        return people.speak(from)
    }
    roar(from){
        return animal.roar(from)
    }
}

const child = new Child()
child.say('Template')

//装饰者模式
class Decorator {
    constructor(people, animal) {
        this.people = people
        this.animal = animal
    }
    speak(from) {
        this.people.speak(from)
    }
    roar(from) {
        this.animal.roar(from)
    }
}

const decorator = new Decorator(people, animal)
decorator.speak('Decorator')
decorator.roar('Decorator')

//建造者模式
class Creator {
    constructor() {
        this.handlers = new Map()
    }

    on(event, callback) {
        this.handlers.set(event, callback)
    }

    emit(event) {
        let handler = this.handlers.get(event)
        if(handler) handler()
    }
}

const creator = new Creator()
creator.on('speak', () => people.speak('Creator'))
creator.on('roar', () => animal.roar('Creator'))
creator.emit('speak')
creator.emit('roar')

//观察者模式
class Observer {
    constructor() {
        this.messages = {}
    }

    subscribe(msg, callback) {
        this.messages[msg] = this.messages[msg] || []
        this.messages[msg].push({callback})
    }

    publish(msg, args) {
        let subs = this.messages[msg]
        if(!subs) return
        for (const sub of subs) {
            sub.callback(args)
        }
    }
}

const observer = new Observer()
observer.subscribe('say', (from) => people.speak(from))
observer.subscribe('say', (from) => animal.roar(from))
observer.publish('say','Observer')

//适配器模式
class Adapter extends People {
    constructor(animal, ...args){
        super(...args)
        this.animal = animal
    }

    roar(from) {
        return this.animal.roar(from)
    }
}

const adapter = new Adapter(new Animal('wolf'), 'paddy')
adapter.speak('Adapter')
adapter.roar('Adapter')