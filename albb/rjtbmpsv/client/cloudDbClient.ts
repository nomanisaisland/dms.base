import { cloud } from './TbmpcloudClient'

export const cloudDbClient = {
  
  collection(tableName) {
    return {
      async insertOne(...args) {
        return await cloudDbCloudfuncInvoke('insertOne', tableName, args);
      },
      async insertMany(...args) {
        return await cloudDbCloudfuncInvoke('insertMany', tableName, args);
      },
      async deleteMany(...args) {
        return await cloudDbCloudfuncInvoke('deleteMany', tableName, args);
      },
      async find(...args) {
        return await cloudDbCloudfuncInvoke('find', tableName, args);
      },
      async replaceOne(...args) {
        return await cloudDbCloudfuncInvoke('replaceOne', tableName, args);
      },
      async updateMany(...args) {
        return await cloudDbCloudfuncInvoke('updateMany', tableName, args);
      },
      async count(...args) {
        return await cloudDbCloudfuncInvoke('count', tableName, args);
      },
      async aggregate(...args) {
        return await cloudDbCloudfuncInvoke('aggregate', tableName, args);
      },
      async createIndex(...args) {
        return await cloudDbCloudfuncInvoke('createIndex', tableName, args);
      },
    }
  },
  async createCollection(tableName) {
    return await cloudDbCloudfuncInvoke('createCollection', tableName, [])
  },
}


async function cloudDbCloudfuncInvoke(methodName, tableName, args) {
  const uploadResult = await cloud.function.invoke(
    'cloudfuncs',
    {
      methodName,
      tableName,
      args,
    },
    'cloudDbInvoke'
  );
  if (!!uploadResult.error) {
    throw uploadResult.error;
  }
  return uploadResult.data;
}