import { rjMy } from "../../rjMy";
import { cloud } from "./TbmpcloudClient";

/**
 * 淘宝小程序适用的用户会话
 */
export class UsessionService {

    /**
     * 获取用户信息，失败即是没有授权，申请授权后再去获取用户信息；
     * 用户拒绝授权时，提示必须授权才能使用，去授权：重复获取授权直到得到授权为止，否：退出小程序
     */
    async tbAuthUser() {
        if (!!this.tbAuthUserPromise) {
            return await this.tbAuthUserPromise;
        }
        this.tbAuthUserPromise = (async () => {
            for (let i = 1; i <= 1; i++) {
                try {
                    const authUser = await rjMy.getAuthUserInfo();
                    return authUser;
                } catch (ex) {
                    try {
                        const auth = await rjMy.authorize({
                            scopes: "scope.userInfo",
                        });
                        void auth;
                        try {
                            const authUser = await rjMy.getAuthUserInfo();
                            return authUser;
                        } catch (error) {
                            //不一定会成功，牵牛子账号获取不到用户信息
                            console.error(error);
                            return undefined;
                        }
                    } catch (ex) {
                        // 千牛端提示
                        const systemInfo = await rjMy.getSystemInfo()
                        if (!systemInfo || systemInfo.model == "千牛") {
                            const confirmRes = await rjMy.confirm({
                                title: "提示",
                                content: "必须授权才可以使用",
                                confirmButtonText: "去授权",
                                cancelButtonText: "退出",
                            });
                            if (!confirmRes.confirm) {
                                rjMy.exit();
                            }
                        } else {
                            rjMy.showToast({
                                content: "当前应用需要点击右上角授权才可以体验完整功能"
                            })
                            throw new Error('授权失败');
                        }
                    }
                }
            }
            // 千牛端提示
            const systemInfo = await rjMy.getSystemInfo()
            if (!systemInfo || systemInfo.model == "千牛") {
                rjMy.alert({
                    title: "授权失败",
                    content: "必须授权才能使用；首次使用必须要主账号登录授权"
                });
                throw new Error('授权失败');
            } else {
                rjMy.showToast({
                    content: "获取授权失败，后续可在右上角授权中心重新授权！"
                })
                throw new Error('授权失败');
            }
        })();
        return await this.tbAuthUserPromise;
    }

    detailPromise = undefined;

    /**
     * 当前用户信息，非完整信息，不一定包含用户名
     */
    async detailTbUnauth() {
        if (!!this.detailPromise) {
            return await this.detailPromise;
        }
        this.detailPromise = (async () => {
            const tbAuthUser = (await this.tbAuthUserPromise) || {};
            const detail = await cloud.function.invoke("cloudfuncs", {
                tbNickName: tbAuthUser.nickName,
                tbAvatar: tbAuthUser.avatar,
            }, "usessionDetailTb");
            return detail;
        })();
        return await this.detailPromise;
    }

    async refresh() {
        this.detailPromise = undefined;
        return await this.detailTbUnauth();
    }

    tbAuthUserPromise = undefined;

    detailAuthLoaded = false;

    /**
     * 当前授权用户，完整信息，包含用户名
     */
    async detailAuthTb() {
        if (!!this.detailAuthLoaded) {
            return await this.detailTbUnauth();
        }
        this.detailAuthLoaded = true;
        const tbAuthUser = await this.tbAuthUser() || {};
        if (!!this.detailPromise) {
            const detail = await this.detailPromise;
            if (
                !!tbAuthUser.nickName && detail.visitor?.tbNickName !== tbAuthUser.nickName ||
                !!tbAuthUser.tbAvatar && detail.visitor?.tbAvatar !== tbAuthUser.avatar
            ) {
                //测试之前的请求，如果不存在用户信息的话，刷新
                this.detailPromise = undefined;
            }
        }
        return await this.detailTbUnauth();
    }

    async detailTb() {
        return await this.detailAuthTb();
    }

    /**
     * 检查用户是否又置顶权限
     */
    permitCheck(usession: any, permitKey: string, permitsStrOnly?: boolean): boolean {
        //权限字段有值
        return ("," + (usession?.user?.permitsStr || "") + ",").includes("," + permitKey + ",") ||
            //用户是店主账号
            !permitsStrOnly && (usession?.user?.tbNickName || "bad1") === (usession.shop?.tbNickName || "bad2");
    }

}