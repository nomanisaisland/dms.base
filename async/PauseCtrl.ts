import { SyncEvent } from "./SyncEvent";

export function pauseCtrlCreate() {
  let onResulme = undefined as SyncEvent | undefined;
  const pauseCtrl = {
    paused: false,
    wait() {
      return new Promise<void>((resolve) => {
        if (!!onResulme) {
          onResulme.regist(resolve)
          return;
        }
        resolve();
      });
    },
    pause() {
      onResulme = new SyncEvent();
      pauseCtrl.paused = true;
    },
    resume() {
      if (!!onResulme) {
        onResulme.trigger();
      }
      onResulme = undefined;
      pauseCtrl.paused = false;
    },
  };
  return pauseCtrl;
}


export type PauseCtrl = ReturnType<typeof pauseCtrlCreate>;