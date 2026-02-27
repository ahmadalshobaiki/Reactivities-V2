import { createContext } from "react";
import CounterStore from "./counterStore";
import { UiStore } from "./uiStore";
import { ActivityStore } from "./activityStore";

// a point of interaction for all the mobx stores I have defined. The interface will contain all stores defined
interface Store {
    counterStore: CounterStore
    uiStore: UiStore
    activityStore: ActivityStore
}
// a concrete object literal implementing the interface
export const store: Store = {
    counterStore: new CounterStore(), // creates an instance of the MobX store
    uiStore: new UiStore(),
    activityStore: new ActivityStore()
}

export const StoreContext = createContext(store); // creates a React context container that holds our Mobx Stores to make it accessible via React. Some sort of dependency injection