import { MpSimpleState } from "../../MpSimpleState";
import { RandomUtil } from "../../../value/RandomUtil";
import { qrcodeCanvas } from "./qrcodeCanvas";
import { rjMy } from "../../rjMy";

MpSimpleState.Component({
  data: () => ({
  }),
  props: {
    canvasId: "",
    text: "",
    width: 200,
    height: 200,
    inputHide: false,
    buttonHide: false,
    style: "",
    className: "",
  },
  onInit() {
    const component = this;
    const canvasId = RandomUtil.guidStringN();
    const { state, ...stateControl } = MpSimpleState.stateControl({
      drawText: undefined,
      get canvasId() {
        return component.props.canvasId || canvasId;
      },
      get text() {
        return component.props.text;
      },
      get width() {
        return component.props.width;
      },
      get height() {
        return component.props.height;
      },
      get inputHide() {
        return component.props.inputHide;
      },
      get buttonHide() {
        return component.props.buttonHide;
      },
      get style() {
        return component.props.style;
      },
      get className() {
        return component.props.className;
      },
      async copy() {
        await rjMy.setClipboard({
          text: state.text,
        });
        rjMy.showToast({
          content: "已复制。",
        });
      },
      async draw() {
        const drawText = JSON.stringify({
          text: state.text,
          width: state.width,
          height: state.height,
        });
        if (drawText !== state.drawText) {
          state.drawText = drawText;
          await stateControl.update();
          console.log({
            text: state.text,
            width: state.width,
            height: state.height,
          });
          qrcodeCanvas(state.canvasId, {
            text: state.text,
            width: state.width,
            height: state.height,
            correctLevel: 1,
          });
        }
      },
      didMount() {
        state.draw();
      },
      didUpdate() {
        state.draw();
      },
    }, component);
    stateControl.update();
  },

});
