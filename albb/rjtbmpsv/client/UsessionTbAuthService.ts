import { rjMy } from "../../rjMy";
import { cloud } from "./TbmpcloudClient";
import { RandomUtil } from "../../../value/RandomUtil";
import { UsessionUnion } from "../model/UsessionUnion";
import { cloudDbClient } from "./cloudDbClient";

/**
 * 旧版，准备移除
 */
export class UsessionService {

    /**
     * 获取用户信息，失败即是没有授权，申请授权后再去获取用户信息；
     * 用户拒绝授权时，提示必须授权才能使用，去授权：重复获取授权直到得到授权为止，否：退出小程序
     */
    async tbAuth(): Promise<my.IGetAuthUserInfoSuccessResult> {
        try {
            const authUser = await rjMy.getAuthUserInfo();
            return authUser;
        } catch (ex) {
            try {
                const auth = await rjMy.authorize({
                    scopes: "scope.userInfo",
                });
                void auth;
                const authUser = await rjMy.getAuthUserInfo();
                return authUser;
            } catch (ex) {
                // const confirmRes = await rjMy.confirm({
                //     title: "提示",
                //     content: "必须授权才可以使用",
                //     confirmButtonText: "去授权",
                //     cancelButtonText: "退出",
                // });
                // if (confirmRes.confirm) {
                //     return await this.tbAuth();
                // }
                // rjMy.exit();
                // throw ex;
                rjMy.showToast({
                    content: "获取授权失败，部分功能需要权限，请前往首页右上角授权设置进行授权！"
                })
                throw new Error("获取获取授权失败")
            }
        }
    }

    async detailTbAuth(): Promise<UsessionUnion> {
        const authUser = await this.tbAuth();
        let user = (await cloudDbClient.collection("user").find({
            tbNickName: authUser.nickName,
        }))[0];
        if (!user) {
            const id = RandomUtil.guidStringN();
            user = {
                _id: id,
                id: id,
                tbNickName: authUser.nickName,
                avatar: authUser.avatar,
                addTime: Date.now(),
            };
            await cloudDbClient.collection("user").insertOne(user);
        }
        return user;
    }

}
