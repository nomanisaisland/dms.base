import { MpSimpleState } from "../../MpSimpleState";
import { RecordUtil } from "../../../value/RecordUtil";
import { RandomUtil } from "../../../value/RandomUtil";

MpSimpleState.Component({
  props: {
    alphaEnable: false,
    value: {
      hsl: { h: 0, s: 0, l: 1, a: 1, },
      hex: '#ffffff',
      rgb: { r: 255, g: 255, b: 255, a: 1, },
      hsv: { h: 0, s: 0, v: 1, a: 1, },
      oldHue: 0,
      source: 'rgb',
    },
  },

  onInit() {
    const component = this;
    const { state, ...stateControl } = MpSimpleState.stateControl({

      inputBtnId: RandomUtil.guidStringN(),

      value: component.props.value,
      get valueText() {
        return !!component.props.alphaEnable && typeof state.value === "object" && typeof state.value.rgb === "object" ?
          `rgba(${state.value.rgb.r}, ${state.value.rgb.g}, ${state.value.rgb.b}, ${state.value.rgb.a})` :
          typeof state.value === "object" ? state.value.hex : state.value;
      },
      get valueHex() {
        return typeof state.value === "object" ? state.value.hex : state.value;
      },

      deriveDataFromProps(nextProps) {
        const value = nextProps.value;
        if (JSON.stringify(value) !== JSON.stringify(state.value)) {
          state.value = value;
          stateControl.update();
        }
      },

      change(e) {
        const valueObject = RecordUtil.deepClone(e.detail.value, p => !/\$/.test(p + ""));
        const typeValue = !component.props.alphaEnable ?
          valueObject.hex : valueObject;
        state.value = RecordUtil.deepClone(valueObject);
        const event = {
          ...e,
          detail: {
            value: RecordUtil.deepClone(typeValue),
            valueObject: RecordUtil.deepClone(valueObject),
          },
          target: {
            dataset: {
              ...Object.keys(component.props).
                filter(p => /^data-/i.test(p)).
                map(p => ({ propsName: p, datasetName: p.replace(/^data-/i, ""), })).
                reduce((pre, cur) => ({
                  ...pre,
                  [cur.datasetName]: component.props[cur.propsName],
                }), {}),
              ...RecordUtil.deepClone(component.props.dataset),
            },
          },
        };
        component.props.onChange(event);
        stateControl.update();
      },

      edit: {
        opened: false,
        open(props = {}) {
          Object.assign(this, props);
          this.opened = true;
          stateControl.update();
        },
        close() {
          this.opened = false;
          stateControl.update();
        },
      },

    }, component);
    stateControl.update();
  },
});
