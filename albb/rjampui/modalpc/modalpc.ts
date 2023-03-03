import { MpSimpleState } from "../../MpSimpleState";

MpSimpleState.Component({
  props: {
    onClose: () => { },
    // onCloseBefore: async () => { },
    closeHide: false,
    maskHide: false,
    canCloseByOutSideClick: false,
    canCloseByMask: false,
    scrollCross: false,
    top: "",
    fill: false,
    animation: undefined,
    loading: false,
    overlayEnable: false,
  },
  onInit() {
    const component = this;
    const { state, ...stateControl } = MpSimpleState.stateControl({
      visible: true,
      canCloseByMask: false,
      async close() {
        if (!!component.props.onCloseBefore) {
          const result = await component.props.onCloseBefore();
          if (result === false) {
            return;
          }
        }
        if (component.props.animation !== false) {
          state.visible = false;
          stateControl.update();
          await new Promise(resolve => setTimeout(resolve, 400));
          state.visible = true;
        }
        component.props.onClose();
      },
      async maskClick() {
        if (state.canCloseByMask) {
          state.close();
        }
      },
    }, component);
    stateControl.update();
  },

});
