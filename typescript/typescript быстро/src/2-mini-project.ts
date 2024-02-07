class Dog {
    constructor(private name: string) {
        
    };

    sayHello(): string {
        return 'Hello from god'
    }
};

class Fish {
    constructor(private name: string) {

    };

    dive(howDeep: number): string {
        return `Hello from hish that is deep on ${howDeep}`
    }
};

type Pet = Dog | Fish;

function talkToPet(pet: Pet): string {
    if(pet instanceof Dog) {
        return pet.sayHello();
    }
    return 'Fish cannot talk, sorry'
}

talkToPet(new Dog('afa'));
talkToPet(new Fish('ege'));
talkToPet({ name: 'ameba' });
