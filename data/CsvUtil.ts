
import { parse, stringify } from "./csvString/CSV";

export class CsvUtil {

  // 'id,title,desc\n1,a,b' => [['id','title','desc'],['1','a','b']]
  static arraysFromCsvCode = function (
    csvCode: string
  ): string[][] {
    const rows = parse(csvCode);
    return rows;
  }

  // [['id','title','desc'],['1','a','b']] => [{id:'1',title,'a',desc:'b'}]
  static recordsFromArrays = function (
    rows: string[][],
  ): Record<string, string>[] {
    const header = rows[0];
    const dataRows = rows.slice(1);
    return dataRows.map(row => {
      return header.reduce((pre, key, index) => {
        return {
          ...pre,
          [key]: row[index],
        };
      }, {}) as { [key: string]: string; };
    });
  }

  // 'id,title,desc\n111,a,b' => [{id:'111',title,'a',desc:'b'}]
  static recordsFromCsvCode = function (
    csvCode: string,
  ): Record<string, string>[] {
    const arrays = this.arraysFromCsvCode(csvCode);
    const records = this.recordsFromArrays(arrays);
    return records;
  }

  static recordsToCsvCode = function (
    records: Record<string, any>[],
    titleRecord?: Record<string, string>,
  ) {
    let code = "";
    const hasTitle = !!titleRecord;
    if (!titleRecord) {
      titleRecord = Object.keys(records[0]).reduce((pre, cur) => ({
        ...pre,
        [cur]: cur,
      }), {}) ?? {};
    }
    const keys = Object.keys(titleRecord);
    if (hasTitle) {
      code += keys.map(key => {
        const title = titleRecord[key] || key;
        return this.cellEncode(title);
      }).join(",") + "\n";
    }
    for (const record of records) {
      code += keys.map(key => {
        return this.cellEncode((record[key] ?? "") + "");
      }).join(",") + "\n";
    }
    return code;
  }

  static cellEncode = function (text: string) {
    return '"' + text.replace(/"/g, '""') + '"';
  }

}