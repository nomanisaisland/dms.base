import { SelectComparer } from './CompareUtil';

export class PropertyKeyComparer<
    TKey extends PropertyKey = PropertyKey
    >
    extends SelectComparer<TKey> {

    static memberPropertyKey = function (
        key: PropertyKey
    ) {
        if (typeof key === "symbol") {
            return key;
        }
        return String(key);
    }

    constructor() {
        super(PropertyKeyComparer.memberPropertyKey);
    }

    static instance = new PropertyKeyComparer();
}