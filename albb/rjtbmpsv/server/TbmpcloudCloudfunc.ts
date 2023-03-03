declare var Buffer: any;

export async function tbmpcloudFileUploadText(context) {
  const cloud = context.cloud;
  const {
    fileContentText,
    fileName,
  } = context.data;
  try {
    return await cloud.file.uploadFile({
      fileContent: new Buffer(fileContentText),
      fileName: fileName,
    });
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function tbmpcloudTopApiInvoke(context) {
  const cloud = context.cloud;
  const {
    api,
    data,
  } = context.data;
  try {
    return await cloud.topApi.invoke({
      api,
      data,
      autoSession: true
    });
  } catch (error) {
    console.log(error);
    return { error };
  }
}
