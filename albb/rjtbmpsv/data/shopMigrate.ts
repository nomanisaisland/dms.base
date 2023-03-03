
export const migrateListInit = [
  {
    key: "202103011109_shop",
    async action({ cloud, }) {

      await cloud.db.createCollection("shop");
      await cloud.db.createCollection("user");
      await cloud.db.createCollection("miniapp");
      await cloud.db.createCollection("visitor");

      if (!"createIndex") {
        await cloud.db.collection("shop").createIndex("id", false, { id: 1, });
        await cloud.db.collection("shop").createIndex("tbOpenId", false, { tbOpenId: 1, });


        await cloud.db.collection("user").createIndex("id", false, { id: 1, });
        await cloud.db.collection("user").createIndex("tbOpenId", false, { tbOpenId: 1, });

        await cloud.db.collection("miniapp").createIndex("id", false, { id: 1, });
        await cloud.db.collection("miniapp").createIndex("tbAppId", false, { tbAppId: 1, });


        await cloud.db.collection("visitor").createIndex("id", false, { id: 1, });
        await cloud.db.collection("visitor").createIndex("userId", false, { userId: 1, miniappId: 1, });
      }

    },
  },
];

