//应在启动时注入 @tbmp/mp-cloud-sdk 的实例

export let cloud = Reflect.get(Reflect, "TbmpcloudClientCloud");

const setupListImpl = [];
const setupList =
    Reflect.get(Reflect, "TbmpcloudClientCloudSetupList") ||
    (Reflect.set(Reflect, "TbmpcloudClientCloudSetupList", setupListImpl), setupListImpl);
setupList.push((value) => {
    cloud = value;
});

export function cloudSetup(value) {
    Reflect.set(Reflect, "TbmpcloudClientCloud", value);
    for (const setup of setupList) {
        setup(value);
    }
}

export function cloudCurrent() {
    return cloud;
}
