import { makeAutoObservable } from 'mobx'

// mobX store -> a global cache for client-side state management
export default class CounterStore {
    title = 'Counter store'; //observable
    count = 42; //observable
    events: string[] = [ // computed value
        `Initial count is ${this.count}`
    ]

    constructor() {
        /* this is the line that makes the class a mobX store by making the properties observable by an <Observer />  
        or a higher order observer() React Functional Component. makeAutoObservable automatically detects the observables such as:
        class properties = observables
        class methods = actions
         */
        makeAutoObservable(this) 
    }

    increment = (amount = 1) => { //action
        this.count+= amount;
        this.events.push(`Incremented by ${amount} - count is now ${this.count}`)
    }

    decrement = (amount = 1) => { //action
        this.count-= amount;
        this.events.push(`Decremented by ${amount} - count is now ${this.count}`)
    }

    get eventCount(){ // get computed value
        return this.events.length
    }
}