
export class RandomUtil {

    static timeString = function () {
        return new Date().getTime().toString();
    }

    static saltString = function () {
        return Math.floor(Math.random() * 1000).toString();
    }

    static timeSaltString = function () {
        return `${this.timeString()}_${this.saltString()}`;
    }

    static guidStringD = function () {
        function s4() {
            return (
                ((Math.random() + 1) * 0x10000) | 0
            ).toString(16).substring(1);
        }
        return (
            s4() + s4() + "-" +
            s4() + "-" +
            s4() + "-" +
            s4() + "-" +
            s4() + s4() + s4()
        );
    }

    static guidStringN = function () {
        function s4() {
            return (
                ((Math.random() + 1) * 0x10000) | 0
            ).toString(16).substring(1);
        }
        return (
            s4() + s4() +
            s4() +
            s4() +
            s4() +
            s4() + s4() + s4()
        );
    }


    static mixStr = function (
        len = 6,
        pool = `abcdefghkmnpqrstuvwxyz123456789`
    ) {
        let res = "";
        for (let i = 0; i < len; i++) {
            const idx = Math.ceil(Math.random() * pool.length);
            res += pool.charAt(idx);
        }
        return res;
    }

}