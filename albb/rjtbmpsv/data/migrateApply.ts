declare var require: any;

/**
 * 应用数据迁移
 */
export const migrateApply = async (context) => {

  if (!!migrateApplyEd) {
    return;
  }
  migrateApplyEd = true;

  const { cloud, } = context;

  try {
    await cloud.db.createCollection("migrate");
  } catch (error) {
    console.error(error);
  }
  const remoteList = await cloud.db.collection("migrate").find({}, { sort: { key: 1, } });
  const migrateList = require('./migrateConfig').migrateConfig.list;

  for (const local of migrateList) {

    const remote = remoteList.find(a => a.key == local.key);
    if (!!remote) {
      continue;
    }

    //begin tran
    try {
      await local.action(context);
      await cloud.db.collection("migrate").insertOne({
        key: local.key,
        time: Date.now(),
      });
    } catch (error) {
      console.error(error);
      const errorMessage = String(
        error?.errorMessage ?? error?.message ?? error
      );
      const errorStack = String(
        error?.errorStack ?? error?.stack
      );
      try {
        try {
          await cloud.db.createCollection("migrateLog");
        } catch (error) {
          console.error(error);
        }
        await cloud.db.collection("migrateLog").insertOne({
          key: local.key,
          time: Date.now(),
          errorMessage,
          errorStack,
        });
      } catch (error) {
        console.error(error);
      }
      throw error;
    }

    //end tran
  }

};

let migrateApplyEd = false;
