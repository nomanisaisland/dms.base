import { My } from "./ampenv/miniTypes";
import { RecordPathUtil } from "../value/RecordUtil";

function rjMyFunc(target: any) {
    let mock: any = undefined;
    const proxy = (...args: any) => {
        if (!!mock) {
            return mock(...args);
        }
        let promiseResolve: any;
        let promiseReject: any;
        const promise = new Promise((resolve, reject) => {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        const rawOptions = args[0];
        const options = args.length > 0 && typeof rawOptions !== "object" ?
            rawOptions : {
                ...rawOptions,
                success(...successArgs: any) {
                    if (!!rawOptions && !!rawOptions.success) {
                        rawOptions.success(...successArgs);
                    }
                    promiseResolve(...successArgs);
                },
                fail(...failArgs: any) {
                    if (!!rawOptions && !!rawOptions.fail) {
                        rawOptions.fail(...failArgs);
                    }
                    promiseReject(...failArgs);
                },
            };
        const rawReturn = (target as any).apply(
            undefined, [options, ...args.slice(1)]
        );
        if (rawReturn !== undefined) {
            return rawReturn;
        }
        return promise;
    };
    proxy.mockOn = (handler: any) => {
        mock = typeof handler === "function" ? handler : () => handler;
    };
    proxy.mockOff = () => {
        mock = undefined;
    };
    proxy.mockOne = (handler: any) => {
        const currentMock = mock;
        mock = (...args: any) => {
            mock = currentMock;
            const handlerFunc = typeof handler === "function" ? handler : () => handler;
            return handlerFunc(...args);
        };
    };
    return proxy as any;
}

function rjMyObject(target: any, depth = 10) {
    if (depth < 0) {
        return target;
    }
    const proxy = Object.keys(target).reduce((pre, cur) => {
        const childTarget = target[cur];
        const childProxy = typeof childTarget === "object" ?
            rjMyObject(childTarget, depth - 1) :
            typeof childTarget === "function" ?
                rjMyFunc(childTarget) :
                childTarget;
        pre[cur] = childProxy;
        return pre;
    }, {} as any);
    return proxy;
}

const rjMyRaw = my;

declare var my: My;

export interface RjMyFunc<
    TRes,
    T extends (...args: any[]) => any
    > {


    (
        ...options: [] | Parameters<T>
    ): Promise<TRes>;

    mockOn(res: TRes): void;

    mockOff(): void;

    mockOne(res: TRes): void;

}

type RjMyObjectMap<T> = {
    [TKey in keyof T]:
    T[TKey] extends (
        (
            options: { success?: (res: infer TRes) => void }
        ) => infer TRet
    ) ? TRet extends void ? (RjMyFunc<TRes, T[TKey]>) : T[TKey] :
    T[TKey];
};

export const rjMyPlus = {

    /**
     * 将对象查询参数字符串 {id:1,items:[{id:1,}]} => "id=1&items[0].id=1"
     */
    navigateQuery(
        data: Record<string, any>
    ): string {
        function kvs(
            data: any, name = ""
        ): { name: string, value: string }[] {
            if (
                !data ||
                typeof data === "string" ||
                typeof data === "number" ||
                typeof data === "boolean" ||
                typeof data === "bigint"
            ) {
                return [{ name, value: data ?? "", }];
            }
            return Object.keys(data).flatMap(
                k => [
                    ...kvs(
                        data[k],
                        Number.isNaN(Number(k)) ? (!!name ? name + "." : "") + k : name + "[" + k + "]"
                    ),
                ],
            );
        }
        const dataKvs = kvs(data);
        const query = dataKvs.map(a => `${encodeURIComponent(a.name)}=${encodeURIComponent(a.value)}`).join("&");
        return !!query ? "?" + query : "";
    },

    /**
     * 在页面中onload中使用，将query还原回navigateQuery前的对象
     */
    navigateProps(
        query: Record<string, string | number>
    ): Record<string, any> {
        const props = Object.keys(query).reduce((pre, name) => {
            const keyPath = RecordPathUtil.pathFromString(name);
            const v = query[name];
            const cur = RecordPathUtil.pathSet(pre, keyPath, v);
            return cur;
        }, {} as any);
        return props;
    },

    /**
     * 拼接打开小程序的链接，可以指定启动参数和启动页面
     */
    navigateAppLink(options: {
        appid: string;
        queryParams?: object;
        page?: string;
    }) {
        let url = `https://m.duanqu.com/?_ariver_appid=${options.appid}`;
        if (!!options.queryParams) {
            const q = `params=${encodeURIComponent(JSON.stringify(options.queryParams))}`;
            url += `&query=${encodeURIComponent(q)}`;
        }
        if (!!options.page) {
            url += `&page=${encodeURIComponent(options.page)}`;
        }
        return url;
    },
};

type RjMy = RjMyObjectMap<My> & {
    rjMyRaw: My;
    rjMy: RjMy;
    rjMyPlus: typeof rjMyPlus;
} & typeof rjMyPlus & {
    //替换全局的my，不建议使用
    globalOn(): void;
};

export const rjMy: RjMy = rjMyObject(rjMyRaw);
Object.assign(
    rjMy,
    {
        tb: rjMyObject(my.tb || {}),
        qn: rjMyObject(my.qn || {}),
        rjMyRaw,
        rjMy,
        rjMyPlus,
        ...rjMyPlus,
        globalOn() {
            //todo subPackage
            my = rjMy as any;
        },
    },
);

(my as any).rjMy = rjMy;
