import { makeAutoObservable } from "mobx";

export class UiStore {
    isLoading = false; //observable

    constructor(){
        makeAutoObservable(this)
    }

    isBusy(){ //action
        this.isLoading = true
    }

    isIdle(){ //action
        this.isLoading = false
    }
}