
export const miniappTbTemplateInstantiate = async (context) => {

  const cloud = context.cloud;
  const {
    clients,
    description,
    ext_json,
    icon,
    name,
    template_id,
    template_version,
    alias,
  } = context.data;
  const tbMiniapp = await cloud.topApi.invoke({
    api: 'taobao.miniapp.template.instantiate',
    data: {
      clients: clients,
      description,
      ext_json,
      icon,
      name,
      template_id,
      template_version,
      alias: alias || name,
    },
    autoSession: true
  });
  return tbMiniapp;
};

export const miniappTbTemplateUpdateapp = async (context) => {
  const cloud = context.cloud;
  const {
    clients,
    app_id,
    ext_json,
    template_id,
    template_version,
    alias,
    desc
  } = context.data;
  const tbMiniapp = await cloud.topApi.invoke({
    api: 'taobao.miniapp.template.updateapp',
    data: {
      clients,
      app_id,
      ext_json,
      template_id,
      template_version,
      ...!!alias ? {
        alias,
      } : {},
      ...!!desc ? {
        desc,
      } : {},
    },
    autoSession: true
  });
  return tbMiniapp;
};

export const miniappTbTemplateOnlineapp = async (context) => {
  const cloud = context.cloud;
  const {
    clients,
    app_id,
    template_id,
    template_version,
    app_version,
  } = context.data;
  const tbMiniapp = await cloud.topApi.invoke({
    api: 'taobao.miniapp.template.onlineapp',
    data: {
      clients,
      app_id,
      template_id,
      template_version,
      app_version,
    },
    autoSession: true
  });
  return tbMiniapp;
};





//小部件实例化
//流程代码参考 https://miniapp.open.taobao.com/doc.htm?docId=119272&docType=1&tag=dev
export const miniappTbWidgetTemplateInstantiate = async (context) => {

  const cloud = context.cloud;
  const {
    description,
    template_id,
    template_version,
  } = context.data;
  const res = await cloud.topApi.invoke({
    api: 'taobao.miniapp.widget.template.instantiate',
    data: {
      param_mini_app_instantiate_template_app_simple_request: {
        template_id,
        template_version,
        description,
      },
    },
    autoSession: true
  });
  return res;
};

export const miniappTbWidgetTemplateUpdateapp = async (context) => {
  const cloud = context.cloud;
  const {
    entity_id,
    template_id,
    template_version,
  } = context.data;
  const res = await cloud.topApi.invoke({
    api: 'taobao.miniapp.widget.template.instance.update',
    data: {
      param_mini_app_instantiate_template_app_update_request: {
        entity_id,
        template_id,
        template_version,
      },
    },
    autoSession: true
  });
  return res;
};
