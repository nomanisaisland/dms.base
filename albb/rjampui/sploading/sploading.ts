import { MpSimpleState } from "../../MpSimpleState";

MpSimpleState.Component({
  props: {
    loading: false,
    className: "",
    style: "",
  },
  onInit() {
    const component = this;
    const { state, ...stateControl } = MpSimpleState.stateControl({
    }, component);
    stateControl.update();
  },

});
