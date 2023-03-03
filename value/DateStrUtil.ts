

export class DateStrUtil {

  /**
   * 返回Date对象
   * @param tzUtc 处理时差，false从utc转为local，true不处理，-1从local转utc
   */
  static norm = function (
    t: Date | number | string | null | undefined,
    tzUtc: boolean | -1 = false,
  ): Date | undefined {
    if (!Number.isNaN(Number(t))) {
      t = Number(t);
    }
    if (!t) {
      return undefined;
    }
    const time = new Date(t);
    if (!tzUtc) {
      time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
    } else if (tzUtc == -1) {
      time.setMinutes(time.getMinutes() + time.getTimezoneOffset());
    }
    return time;
  }

  /**
   * 时间格式，计算时差 yyyy-mm-dd hh:ii:ss
   * @param tzUtc 处理时差，false从utc转为local，true不处理，-1从local转utc
   */
  static formatAyyyymmddhhiiss = function (
    t: Date | number | string | null | undefined,
    tzUtc: boolean | -1 = false,
  ) {
    const time = DateStrUtil.norm(t, tzUtc);
    if (!time) {
      return "";
    }
    const str = time.toJSON().replace(/T/ig, " ").replace(/\..*/, "");
    return str;
  }


  /**
   * 弃用 时间格式，计算时差 yyyy-mm-dd hh:ii:ss
   */
  static formatLjson = function (
    t: Date | number | string | null | undefined,
    tzUtc: boolean | -1 = false,
  ) {
    return DateStrUtil.formatAyyyymmddhhiiss(t, tzUtc);
  }

  /**
 * 时间格式，计算时差 yyyy-mm-dd
 */
  static formatAyyyymmdd = function (
    t: Date | number | string | null | undefined,
    tzUtc: boolean | -1 = false,
  ) {
    return DateStrUtil.formatAyyyymmddhhiiss(t, tzUtc).replace(/\s+.*$/i, "");
  }
}