import { Exception } from "../value/Exception";


function kvs(data: unknown, name = ""): {
    name: string;
    value?: unknown;
    file?: Blob;
    fileName?: string;
}[] {
    if ((data ?? undefined) === undefined) {
        return [{ name, value: "", }];
    }
    if (typeof data === "boolean") {
        return [{ name, value: !!data ? "1" : "", }];
    }
    if (
        typeof data === "string" ||
        typeof data === "number" ||
        typeof data === "bigint"
    ) {
        return [
            { name, value: data + "", }
        ];
    }
    if (
        typeof Blob !== "undefined" &&
        data instanceof Blob
    ) {
        return [{ name, file: data, }];
    }
    if (
        typeof HTMLInputElement !== "undefined" &&
        data instanceof HTMLInputElement &&
        data.type === "file"
    ) {
        return Array.from(data.files || []).map(
            file => ({ name, file, })
        );
    }
    if (
        typeof data === "object" && (
            !!(data as any).fileHold ||
            !!(data as any).originFileObj
        )
    ) {
        if (!(data as any).originFileObj) {
            return [];
        }
        return [{ name, file: (data as any).originFileObj, }];
    }
    return Object.keys(data as object).flatMap(
        k => [
            ...kvs(
                (data as any)[k],
                Number.isNaN(Number(k)) ? (!!name ? name + "." : "") + k : name + "[" + k + "]"
            ),
        ],
    );
}

type SimpleRpcController = {
    [action: string]: (data?: object) => Promise<unknown>;
};

type SimpleRpcControllerUrlService = {
    [action: string]: (data?: object) => string;
};

export class SimpleRpc {

    url(
        controllerPath: string,
        action: string,
        data: object = {},
    ): string {
        const url = new URL(`/${controllerPath}.php?do=${action}`, location.href);
        const dataKvs = kvs(data);
        dataKvs.forEach(kv => {
            let name = kv.name;
            name = name.replace(/\[/g, ".");
            name = name.replace(/\]/g, "");
            name = name.replace(/\./g, "__dot__");
            url.searchParams.append(name, String(kv.value));
        });
        return url.toString();
    }

    async call(
        controllerPath: string,
        action: string,
        data: object = {}
    ): Promise<unknown> {

        const url = this.url(controllerPath, action);
        const dataKvs = kvs(data);
        const body = new FormData();
        dataKvs.forEach(kv => {
            let name = kv.name;
            name = name.replace(/\[/g, ".");
            name = name.replace(/\]/g, "");
            name = name.replace(/\./g, "__dot__");
            if (!!kv.file) {
                body.append(name, kv.file, kv.fileName);
                return;
            }
            body.append(name, String(kv.value ?? ""));
        });
        const res = await fetch(url, {
            method: "post",
            body,
        });
        const rDataText = await res.text();
        const rDataTextTrim = rDataText.replace(/^[^\{]+/, '');
        const rData = JSON.parse(rDataTextTrim);
        if (rData?.exception) {
            throw new Exception(rData.exception);
        }
        return rData;

    }

    controller(controllerPath: string): SimpleRpcController {
        const proxy = new Proxy({}, {
            get: (_target, action) => {
                if (action === "url") {
                    return (action: string, data: object = {}) => {
                        return this.url(controllerPath, action, data);
                    };
                }
                return (data: object = {}) => {
                    return this.call(controllerPath, String(action), data);
                };
            },
        });
        return proxy;
    }

    controllerUrl(
        controllerPath: string
    ): SimpleRpcControllerUrlService {
        const proxy = new Proxy({} as SimpleRpcControllerUrlService, {
            get: (_target, action) => {
                return (data = {}) => {
                    return this.url(controllerPath, String(action), data);
                };
            },
        });
        return proxy;
    }

}