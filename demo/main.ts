/**
 * @Author: lujiafeng
 * @Email: 934789537@qq.com
 * @Date: 2023-02-17 14:33:15
 * @Description: 
 * @LastEditors: lujiafeng
 * @LastEditTime: 2023-02-17 15:31:39
 */
const control = {
  type: 'form',
  name: '机器人用户',
  alarm_balance: 10000,
  bot_enable: true,
  bot_price_max: 1,
  bot_price_min: 0,
  price_max: 110,
  price_min: 100,
  recovery_minute_max: 5,
  recovery_minute_min: 1,
  recovery_time_max: 1,
  recovery_time_min: 0,
  strategies: [
    {
      item_list: [],
      items_way: 1,
      percent: 50,
      price_max: 20000000,
      price_min: 10000000,
      recovery_pay_second_max: 60,
      recovery_pay_second_min: 10,
      recovery_second_max: 60,
      recovery_second_min: 10,
      recovery_time_way: 1,
      recovery_way: 2,
      _id: '00001677304411379',
    },
  ],
};
// control_name
class StateContextControl {
  state = null
  keyPath = [0]
  constructor(state,keyPath = [0]) {
    this.state = state,
    this.keyPath = keyPath
  }

  childCache = {};

  child(childKey) {
    let child = this.childCache[childKey];
    if (!child) {
      child = new StateContextControl(this.state, [...this.keyPath, childKey]);
      child.parentCache = { value: this };
      this.childCache[childKey] = child;
    }
    return child;
  }
  _proxy = new Proxy(
    {},
    {
      get: (_target, prop) => {
        return this.child(prop);
      },
    }
  );

  get data () {
    let childData = this.state
    for(let i= 1; i < this.keyPath.length; i++) {
      childData = childData[this.keyPath[i]]
    }
    console.log(childData)
    return childData
  }
  set data (val) {
    let childVal = this.state
    for(let i= 1; i < this.keyPath.length; i++) {
      if(i === this.keyPath.length - 1) {
        childVal[this.keyPath[i]] = val
      } else {
        childVal = childVal[this.keyPath[i]]
      }
    }
  }
  _ = this._proxy
}

const state = new StateContextControl(control)
