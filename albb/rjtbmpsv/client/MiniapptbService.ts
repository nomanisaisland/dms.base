import { SimpleIoc } from "../../../pack/SimpleIoc";
import { Miniapp, MiniappTemplate } from "../model/Miniapp";
import { cloud } from "./TbmpcloudClient";
import { UsessionService } from "./UsessionService";
import { cloudDbClient } from "./cloudDbClient";

/**
 * 发布到淘宝
 */
export async function pubTb(
    model: Miniapp,
    template?: MiniappTemplate,
) {

    if (!template) {
        template = (
            await cloud.function.invoke("cloudfuncs", {
            }, "miniappTemplateList")
        ).filter(a => a.runatType == model.runatType)[0];
    }

    model.templateId = template.id;
    model.tbTemplateId = template.tbTemplateId;
    model.tbTemplateVersion = template.tbTemplateVersion;

    //小程序实例化
    if (model.runatType == 'miniapp') {

        //实例化创建
        if (!model.tbAppId) {

            const tbMiniapp = await cloud.function.invoke("cloudfuncs", {
                clients: model.tbClients,
                description: model.description,
                ext_json: model.tbExtJson,
                icon: model.icon,
                name: model.name,
                alias: model.alias,
                template_id: model.tbTemplateId,
                template_version: model.tbTemplateVersion,
            }, "miniappTbTemplateInstantiate");
            if (!!tbMiniapp.error) {
                throw {
                    error: tbMiniapp.error,
                    message: tbMiniapp.error.sub_msg,
                };
            }
            model.tbPreViewUrl = tbMiniapp.pre_view_url;
            model.tbAppId = tbMiniapp.app_id;
            model.tbAppkey = tbMiniapp.appkey;
            model.tbAppVersion = tbMiniapp.app_version;
            model.tbAppName = tbMiniapp.app_name;
            model.tbAppAlias = tbMiniapp.app_alias;
            model.tbAppDescription = tbMiniapp.app_description;
            model.tbAppIcon = tbMiniapp.app_icon;

        } else {

            //更新实例
            const tbMiniapp = await cloud.function.invoke("cloudfuncs", {
                clients: model.tbClients,
                ext_json: model.tbExtJson,
                template_id: model.tbTemplateId,
                template_version: model.tbTemplateVersion,
                app_id: model.tbAppId,
                ...model.name == model.tbAppAlias ? undefined : { alias: model.name },
                ...model.description == model.tbAppDescription ? undefined : { desc: model.description },
            }, "miniappTbTemplateUpdateapp");
            if (!!tbMiniapp.error) {
                throw {
                    error: tbMiniapp.error,
                    message: tbMiniapp.error.sub_msg,
                };
            }
            model.tbPreViewUrl = tbMiniapp.pre_view_url;
            model.tbAppId = tbMiniapp.app_id;
            model.tbAppkey = tbMiniapp.appkey;
            model.tbAppVersion = tbMiniapp.app_version;
            model.tbAppName = tbMiniapp.app_name;
            model.tbAppAlias = tbMiniapp.app_alias;
            model.tbAppDescription = tbMiniapp.app_description;
            model.tbAppIcon = tbMiniapp.app_icon;
        }

        //上线刚发布的版本
        const tbOnline = await cloud.function.invoke("cloudfuncs", {
            clients: model.tbClients,
            app_id: model.tbAppId,
            template_id: model.tbTemplateId,
            template_version: model.tbTemplateVersion,
            app_version: model.tbAppVersion,
        }, "miniappTbTemplateOnlineapp");
        if (!!tbOnline.error) {
            throw {
                error: tbOnline.error,
                message: tbOnline.error.sub_msg,
            };
        }

        model.tbOnlineUrl = tbOnline.app_info.online_url;


        //将发布后的信息更新保存到数据库
        const usessionService = SimpleIoc.resolve(UsessionService);
        const usession = await usessionService.detailTb();
        model.editTime = model.editTime || Date.now();
        model.editUserId = usession.user.id;
        model.pubTbTime = Date.now();

        await cloudDbClient.collection("miniapp").updateMany({
            shopId: usession.shop.id,
            id: model.id,
        }, {
            $set: {
                tbTemplateId: model.tbTemplateId,
                tbTemplateVersion: model.tbTemplateVersion,
                tbAppId: model.tbAppId,
                tbClients: model.tbClients,
                tbExtJson: model.tbExtJson,
                tbAppkey: model.tbAppkey,
                tbAppVersion: model.tbAppVersion,
                tbAppDescription: model.tbAppDescription,
                tbAppName: model.tbAppName,
                tbAppAlias: model.tbAppAlias,
                tbAppIcon: model.tbAppIcon,
                tbPreViewUrl: model.tbPreViewUrl,
                tbOnlineUrl: model.tbOnlineUrl,
                editTime: model.editTime,
                editUserId: model.editUserId,
                pubTbTime: model.pubTbTime,
            },
        });



    }


    //小部件实例化
    if (model.runatType == 'widget') {

        //实例化创建
        if (!model.tbAppId) {

            const res = await cloud.function.invoke("cloudfuncs", {
                description: model.description,
                template_id: model.tbTemplateId,
                template_version: model.tbTemplateVersion,
            }, "miniappTbWidgetTemplateInstantiate");
            if (res?.result?.success != "true") {
                throw {
                    errorMessage:
                        res?.result?.err_message ||
                        res?.sub_msg ||
                        'error',
                };
            }
            const tbMiniapp = res.result.model;
            model.tbPreViewUrl = tbMiniapp.pre_view_url;
            model.tbAppId = tbMiniapp.app_id || tbMiniapp.id;
            model.tbAppkey = tbMiniapp.appkey;
            model.tbAppVersion = tbMiniapp.app_version ||
                tbMiniapp.new_version ||
                tbMiniapp.online_version;
            model.tbAppName = tbMiniapp.app_name;
            model.tbAppAlias = tbMiniapp.app_alias;
            model.tbAppDescription = tbMiniapp.app_description;
            model.tbAppIcon = tbMiniapp.app_icon;
            model.tbOnlineCode = tbMiniapp.online_code;

        } else {

            //更新实例
            const res = await cloud.function.invoke("cloudfuncs", {
                entity_id: model.tbAppId,
                template_id: model.tbTemplateId,
                template_version: model.tbTemplateVersion,
            }, "miniappTbWidgetTemplateUpdateapp");
            if (res?.result?.success != "true") {
                throw {
                    errorMessage:
                        res?.result?.err_message ||
                        res?.sub_msg ||
                        'error',
                };
            }
            const tbMiniapp = res.result.model;
            model.tbPreViewUrl = tbMiniapp.pre_view_url;
            model.tbAppId = tbMiniapp.app_id || tbMiniapp.id;
            model.tbAppkey = tbMiniapp.appkey;
            model.tbAppVersion = tbMiniapp.app_version ||
                tbMiniapp.online_version;
            model.tbAppName = tbMiniapp.app_name;
            model.tbAppAlias = tbMiniapp.app_alias;
            model.tbAppDescription = tbMiniapp.app_description;
            model.tbAppIcon = tbMiniapp.app_icon;
        }

        // 小部件不用调用更新上线


        //将发布后的信息更新保存到数据库
        const usessionService = SimpleIoc.resolve(UsessionService);
        const usession = await usessionService.detailTb();
        model.editTime = model.editTime;
        model.editUserId = usession.user.id;
        model.pubTbTime = Date.now();

        await cloudDbClient.collection("miniapp").updateMany({
            shopId: usession.shop.id,
            id: model.id,
        }, {
            $set: {
                tbTemplateId: model.tbTemplateId,
                tbTemplateVersion: model.tbTemplateVersion,
                tbAppId: model.tbAppId,
                tbClients: model.tbClients,
                tbExtJson: model.tbExtJson,
                tbAppkey: model.tbAppkey,
                tbAppVersion: model.tbAppVersion,
                tbAppDescription: model.tbAppDescription,
                tbAppName: model.tbAppName,
                tbAppAlias: model.tbAppAlias,
                tbAppIcon: model.tbAppIcon,
                tbPreViewUrl: model.tbPreViewUrl,
                tbOnlineUrl: model.tbOnlineUrl,
                tbOnlineCode: model.tbOnlineCode,
                editTime: model.editTime,
                editUserId: model.editUserId,
                pubTbTime: model.pubTbTime,
            },
        });



    }




}
