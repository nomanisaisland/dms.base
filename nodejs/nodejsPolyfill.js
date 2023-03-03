if (!Array.prototype.flat) {

    function flat() {
        var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

        return depth ? Array.prototype.reduce.call(this, function(acc, cur) {
            if (Array.isArray(cur)) {
                acc.push.apply(acc, flat.call(cur, depth - 1));
            } else {
                acc.push(cur);
            }

            return acc;
        }, []) : Array.prototype.slice.call(this);

    }

    Object.defineProperty(Array.prototype, 'flat', {
        configurable: true,
        value: function flat() {
            var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);

            return depth ? Array.prototype.reduce.call(this, function(acc, cur) {
                if (Array.isArray(cur)) {
                    acc.push.apply(acc, flat.call(cur, depth - 1));
                } else {
                    acc.push(cur);
                }

                return acc;
            }, []) : Array.prototype.slice.call(this);
        },
        writable: true
    });
}

if (!Array.prototype.flatMap) {
    function flatMap() {
        return Array.prototype.map.apply(this, arguments).flat();
    }
    Object.defineProperty(Array.prototype, 'flatMap', {
        configurable: true,
        value: function flatMap() {
            return Array.prototype.map.apply(this, arguments).flat();
        },
        writable: true
    });
}


if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }
            var o = Object(this);
            var len = o.length >>> 0;
            if (len === 0) {
                return false;
            }
            var n = fromIndex | 0;
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }
            while (k < len) {
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                k++;
            }
            return false;
        }
    });
}