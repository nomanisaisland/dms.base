declare var require: any;

export const migrateConfig = {
  list: [
    ...require('./shopMigrate').migrateListInit,
  ],
};
