import { useContext } from "react";
import { StoreContext } from "../stores/store";

export function useStore() {
    return useContext(StoreContext) // lets our react components access the React Context which contains our Mobx store (the link between the react component and the react context that contains the Mobx store)
}