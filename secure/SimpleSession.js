export class SimpleSession {

    storeKey() {
        return "SimpleSession";
    }

    get() {
        const storeKey = this.storeKey();
        const dataJson = localStorage.getItem(storeKey) || "null";
        const data = JSON.parse(dataJson);
        return data;
    }

    set(data) {
        const storeKey = this.storeKey();
        const dataJson = JSON.stringify(data);
        localStorage.setItem(storeKey, dataJson);
        return dataJson;
    }

}