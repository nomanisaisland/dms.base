
export const cloudDbInvoke = async (context) => {

  const { db } = context.cloud;
  const { methodName, tableName, args } = context.data
  try {
    if (methodName === "createCollection") {
      const res = await db.createCollection(tableName);
      return {
        input: context.data,
        data: res,
      };
    }
    if (methodName === "createIndex") {
      return {
        input: context.data,
        data: '请手动创建索引',
      };
    }
    const res = await db.collection(tableName)[methodName](...args);
    return {
      input: context.data,
      data: res,
    };
  } catch (error) {
    return {
      input: context.data,
      error: (
        error && error.errorMessage ||
        error && error.message ||
        error || "error"
      ).toString(),
    }
  }
};