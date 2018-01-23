export default class Store {
    constructor(){
        if(! Store.instance){
            this._state = {};
            Store.instance = this;
        }

        return Store.instance;
    }

    getState() {
        return this._state;
    }

    setState(newState) {
        this._state = newState;
    }

    setProperty(propertyName, propertyValue) {
        this._state[propertyName] = propertyValue;
    }

    getProperty(propertyName) {
        if(this._state.hasOwnProperty(propertyName)) {
            return propertyName;
        }

        return null;
    }
}
