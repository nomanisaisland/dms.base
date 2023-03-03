import { SimpleStateEntry, SimpleStateDict, SimpleStateKey } from "../model/SimpleStateEntry";
import { CancellationToken, SourceCancellationToken } from "../async/CancellationToken";
import { OperationCanceledException } from "../value/Exception";
import { RecordPathUtil } from "../value/RecordUtil";


export interface MpSimpleStateControl<T> {
  stateDict: SimpleStateDict,
  stateEntry: SimpleStateEntry<T>,
  update(): void;
}

export class MpSimpleState {

  static stateControl<
    T extends object
  >(
    defaultValue: T | (() => T),
    componentOrPage: any,
    {
      propFilter = p => !/\$/.test(p + ""),
    }: {
      propFilter?: (p: string | number, o: any) => boolean,
    } = {},
  ) {
    const state = typeof defaultValue === "function" ?
      (defaultValue as (() => T))() : defaultValue;
    const stateDict = new SimpleStateDict();
    const stateEntry = SimpleStateEntry.fromCreateSlot(state, stateDict);

    function fieldsMap(
      stateEntry: SimpleStateEntry,
      name: string[] = [],
      container?: [object],
    ): any[] {
      const k = name[name.length - 1];
      const value = !container ?
        RecordPathUtil.pathGet(state, name) :
        container[0][k];
      const field = {
        name,
        value,
        stateEntry: stateEntry,
      };
      if (
        value === undefined ||
        value === null ||
        typeof value !== "object"
      ) {
        return [field];
      }
      const childFields = Object.keys(value as any).
        filter(p => propFilter(p, value)).
        flatMap(
          k => fieldsMap(
            stateDict.reflect(SimpleStateKey.from(value, k)),
            [...name, k],
            [value],
          )
        );
      return [
        {
          ...field,
          container: true,
        },
        ...childFields,
      ];
    }

    async function updateUnit() {

      ++versionValue;

      const methods = componentOrPage.methods || (componentOrPage.methods = {});
      const data = {};
      const oldFields = componentOrPage.simpleStateFields || [];
      for (const field of oldFields) {
        if (!!field.methodName) {
          delete methods[field.methodName];
          delete componentOrPage[field.methodName];
          delete methods["on" + field.methodName];
          delete componentOrPage["on" + field.methodName];
          if (field.name.length === 1) {
            const key = field.name[0];
            delete methods[key];
            delete componentOrPage[key];
          }
        }
        if (field.name.length == 1) {
          const key = field.name[0];
          data[key] = "";
          data[key + "$simpleState"] = "";
        }
      }

      const fields = fieldsMap(stateEntry);
      componentOrPage.simpleStateFields = fields;
      for (const field of fields) {
        const containerName = field.name.slice(0, field.name.length - 1);
        const key = field.name[field.name.length - 1] || "";
        if (typeof field.value === "function") {
          field.methodName = "onSimpleState" +
            field.name.map(a => a.substr(0, 1).toUpperCase() + a.substr(1)).join("");

          const container = RecordPathUtil.pathGet(state, containerName);
          const func = field.value.bind(container);
          methods[field.methodName] = func;
          componentOrPage[field.methodName] = func;
          methods["on" + field.methodName] = func;
          componentOrPage["on" + field.methodName] = func;
          RecordPathUtil.pathSetEffect(data, field.name, field.methodName);
          if (field.name.length === 1) {
            methods[key] = func;
            componentOrPage[key] = func;
          }
          continue;
        }
        const simpleState = Object.create(
          Object.create({}, {
            stateEntry: {
              value: field.stateEntry,
              enumerable: true,
              configurable: true,
              writable: true,
            },
            control: {
              value: stateControl,
              enumerable: true,
              configurable: true,
              writable: true,
            },
          }), {
          name: {
            value: RecordPathUtil.pathToString(field.name),
            enumerable: true,
            configurable: true,
            writable: true,
          },
          help: {
            value: !!field.stateEntry.validating ? "正在验证" :
              field.stateEntry.errorMessage,
            enumerable: true,
            configurable: true,
            writable: true,
          },
          validateState: {
            value: !!field.stateEntry.validating ? "loading" :
              !!field.stateEntry.errorMessage ? "error" :
                !!field.touched ? "success" : "",
            enumerable: true,
            configurable: true,
            writable: true,
          },
          errorMessage: {
            value: field.stateEntry.errorMessage,
            enumerable: true,
            configurable: true,
            writable: true,
          },
          touched: {
            value: field.stateEntry.touched,
            enumerable: true,
            configurable: true,
            writable: true,
          },
          validating: {
            value: field.stateEntry.validating,
            enumerable: true,
            configurable: true,
            writable: true,
          },
        });
        const value = !!field.container ? !Array.isArray(field.value) ? {
          $simpleState: simpleState,
        } : [] : field.value;
        RecordPathUtil.pathSetEffect(data, field.name, value);
        const container = RecordPathUtil.pathGet(data, containerName);
        if (!Array.isArray(container)) {
          RecordPathUtil.pathSetEffect(
            data,
            [...containerName, key + "$simpleState"],
            simpleState,
          );
        }
      }
      return await new Promise((resolve, reject) => {
        if (!!componentOrPage.simpleStateDidUnmount) {
          //Object.assign(componentOrPage.data, data);
          //reject();
        }
        componentOrPage.setData(data, resolve);
      });
    };

    let handleTimer = undefined;
    let handleResolve;
    let handleReject;
    let handlePromise = new Promise((resolve, reject) => {
      handleResolve = resolve;
      handleReject = reject;
    });
    let handleLast = Date.now();
    let handleFirst = true;
    const updateBatch = async () => {
      if (!!handleTimer && Date.now() - handleLast > 500) {
        return await handlePromise;
      }
      if (!!handleTimer) {
        clearTimeout(handleTimer);
        handleTimer = undefined;
      }
      const handleAction = () => {
        handleTimer = undefined;
        handleLast = Date.now();
        updateUnit().then(() => {
          handleResolve();
          handlePromise = new Promise((resolve, reject) => {
            handleResolve = resolve;
            handleReject = reject;
          });
        }).catch((error) => {
          handleReject(error);
          handlePromise = new Promise((resolve, reject) => {
            handleResolve = resolve;
            handleReject = reject;
          });
        });
      };
      if (!!handleFirst) {
        handleFirst = false;
        handleAction();
        return;
      }
      handleTimer = setTimeout(handleAction, 1000 / 30);
      return await handlePromise;

    };
    stateDict.updateEvent.regist(updateBatch);

    let versionValue = 0;
    const version = () => {
      return versionValue;
    };

    const stateControl = {
      state,
      stateInstance: state,
      stateDict,
      stateEntry,
      updateUnit,
      update: updateBatch,
      // update: async () => {
      //   await stateDict.updateEvent.trigger();
      // },
      fieldValueSet: async (name, value) => {
        const namePath = RecordPathUtil.pathFromString(name);
        RecordPathUtil.pathSetEffect(state, namePath, value);
        stateControl.update();
      },
      fieldAction: async ({
        name,
        action = "set",
        value,
        inv = false,
      }: {
        name: string;
        action?: string;
        value?: any;
        inv?: boolean;
      }) => {
        const namePath = RecordPathUtil.pathFromString(name);
        if (action === "set") {
          if (inv) {
            value = !value;
          }
          RecordPathUtil.pathSetEffect(state, namePath, inv ? !value : value);
        }
        if (action === "add") {
          const arrayNamePath = namePath;
          let array = RecordPathUtil.pathGet(state, arrayNamePath) as any[];
          if (!array) {
            array = [];
            RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
          }
          array[inv ? "unshift" : "push"](value);
        }
        if (action === "remove") {
          const arrayNamePath = namePath.slice(0, namePath.length - 1);
          const index = Number(namePath[namePath.length - 1]);
          let array = RecordPathUtil.pathGet(state, arrayNamePath) as any[];
          if (!array) {
            array = [];
            RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
          }
          array.splice(index, 1);
        }
        if (action === "moveUp") {
          const arrayNamePath = namePath.slice(0, namePath.length - 1);
          let array = RecordPathUtil.pathGet(state, arrayNamePath) as any[];
          if (!array) {
            array = [];
            RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
          }
          const index = Number(namePath[namePath.length - 1]);
          const otherIndex = index - 1;
          if (
            otherIndex < 0 || otherIndex > array.length - 1 ||
            index < 0 || index > array.length - 1
          ) {
            return;
          }
          const item = array[index];
          const other = array[otherIndex];
          array[index] = other;
          array[otherIndex] = item;
        }
        if (action === "moveDown") {
          const arrayNamePath = namePath.slice(0, namePath.length - 1);
          let array = RecordPathUtil.pathGet(state, arrayNamePath) as any[];
          if (!array) {
            array = [];
            RecordPathUtil.pathSetEffect(state, arrayNamePath, array);
          }
          const index = Number(namePath[namePath.length - 1]);
          const otherIndex = index + 1;
          if (
            otherIndex < 0 || otherIndex > array.length - 1 ||
            index < 0 || index > array.length - 1
          ) {
            return;
          }
          const item = array[index];
          const other = array[otherIndex];
          array[index] = other;
          array[otherIndex] = item;
        }
        stateControl.update();
      },
      fields: (...names: string[]) => {
        const paths = names.map(a => RecordPathUtil.pathFromString(a));
        const fields = fieldsMap(stateEntry).filter(field =>
          paths.length < 1 ||
          paths.some(path =>
            RecordPathUtil.pathStartMatch(
              field.name,
              path,
            ) ||
            RecordPathUtil.pathStartMatch(
              path,
              field.name,
            )
          )
        );
        return fields;
      },
      version,
    };
    componentOrPage.simpleStateControl = stateControl;
    return stateControl;
  }

  static validator = function (
    stateControl,
    rules: object,
  ) {
    let validCt = new SourceCancellationToken();
    const validator = {
      valid: async (...names: string[]) => {
        validCt.cancel();
        const validCtLocal = validCt = new SourceCancellationToken();
        const fields = stateControl.fields(...names);
        fields.forEach(field => {
          field.stateEntry.validating = true;
          field.stateEntry.errorMessage = "";
          field.stateEntry.touched = true;
        });
        stateControl.update();
        validCtLocal.register(() => {
          fields.forEach(field => {
            field.stateEntry.validating = false;
            field.stateEntry.errorMessage = "";
          });
        });
        try {
          const state = stateControl.stateEntry.data;
          const validatorImpl = new Validator(rules);
          await validatorImpl.validate(state);
          validCtLocal.throwIfRequested();
          validCtLocal.cancel();
          stateControl.update();
          return true;
        } catch (error) {
          if (error instanceof OperationCanceledException) {
            throw error;
          }
          validCtLocal.throwIfRequested();
          validCtLocal.cancel();
          if (!!error.errors) {
            fields.forEach(field => {
              field.stateEntry.validating = false;
              field.stateEntry.errors = error.errors.
                filter(er =>
                  RecordPathUtil.pathStartMatch(
                    RecordPathUtil.pathFromString(er.field),
                    field.name
                  )
                );
            });
          }
          stateControl.update();
          return false;
        }
      },
    };
    return validator;
  }

  static Page = function ({
    events,
    ...options
  }: any) {
    return Page({
      onLoad(...args) {
        this.simpleStateControl?.state?.onLoad?.(...args);
      },
      onShow(...args) {
        this.simpleStateControl?.state?.onShow?.(...args);
      },
      onReady(...args) {
        this.simpleStateControl?.state?.onReady?.(...args);
      },
      onHide(...args) {
        this.simpleStateControl?.state?.onHide?.(...args);
      },
      onUnload(...args) {
        this.simpleStateControl?.state?.onUnload?.(...args);
      },
      onTitleClick(...args) {
        this.simpleStateControl?.state?.onTitleClick?.(...args);
      },
      onPullDownRefresh(...args) {
        this.simpleStateControl?.state?.onPullDownRefresh?.(...args);
      },
      onReachBottom(...args) {
        this.simpleStateControl?.state?.onReachBottom?.(...args);
      },
      onShareAppMessage(...args) {
        this.simpleStateControl?.state?.onShareAppMessage?.(...args);
      },
      onundefined(e) {
        void e;
      },
      events: {
        onBack(...args) {
          this.simpleStateControl?.state?.onBack?.(...args);
        },
        onKeyboardHeight(...args) {
          this.simpleStateControl?.state?.onKeyboardHeight?.(...args);
        },
        onOptionMenuClick(...args) {
          this.simpleStateControl?.state?.onOptionMenuClick?.(...args);
        },
        onPopMenuClick(...args) {
          this.simpleStateControl?.state?.onPopMenuClick?.(...args);
        },
        onPullIntercept(...args) {
          this.simpleStateControl?.state?.onPullIntercept?.(...args);
        },
        onPullDownRefresh(...args) {
          this.simpleStateControl?.state?.onPullDownRefresh?.(...args);
        },
        onTitleClick(...args) {
          this.simpleStateControl?.state?.onTitleClick?.(...args);
        },
        beforeTabItemTap(...args) {
          this.simpleStateControl?.state?.beforeTabItemTap?.(...args);
        },
        onResize(...args) {
          this.simpleStateControl?.state?.onResize?.(...args);
        },
        onundefined(e) {
          void e;
        },
        ...events,
      },
      ...options,
    });
  }

  static Component = function ({
    onInit,
    deriveDataFromProps,
    didMount,
    didUpdate,
    didUnmount,
    methods,
    ...otherOptions
  }: any) {
    const component2 = (() => {
      try {
        return my.canIUse("component2");
      } catch {
        return true;
      }
    })();
    const options = {
      onInit(...args) {
        this.props.onRef?.(this);
        this.simpleStateComponentInited = true;
        onInit?.call(this, ...args);
        this.simpleStateControl?.state?.onInit?.(...args);
      },
      deriveDataFromProps(...args) {
        this.props.onRef?.(this);
        deriveDataFromProps?.call(this, ...args);
        this.simpleStateControl?.state?.deriveDataFromProps?.(...args);
      },
      didMount(...args) {
        this.props.onRef?.(this);
        if (!component2 && !this.simpleStateComponentInited) {
          this.simpleStateComponentInited = true;
          onInit?.call(this, ...args);
        }
        if (!component2) {
          options.deriveDataFromProps?.call(this, this.props);
        }
        didMount?.call(this, ...args);
        this.simpleStateControl?.state?.didMount?.(...args);
      },
      didUpdate(...args) {
        this.props.onRef?.(this);
        if (!component2) {
          options.deriveDataFromProps?.call(this, this.props);
        }
        didUpdate?.call(this, ...args);
        this.simpleStateControl?.state?.didUpdate?.(...args);
      },
      didUnmount(...args) {
        this.simpleStateDidUnmount = true;
        didUnmount?.call(this, ...args);
        this.simpleStateControl?.state?.didUnmount?.(...args);
      },

      methods: {
        onundefined(e) {
          void e;
        },
        ...methods,
      },
      ...otherOptions,
    };
    return Component(options);
  }

}

//应在启动时注入Validator的实例
//https://github.com/yiminghe/async-validator
export let Validator = Reflect.get(Reflect, "MpSimpleStateValidator");

const setupListImpl = [];
const setupList =
  Reflect.get(Reflect, "MpSimpleStateValidatorSetupList") as typeof setupListImpl ||
  (Reflect.set(Reflect, "MpSimpleStateValidatorSetupList", setupListImpl), setupListImpl);
setupList.push((value) => {
  Validator = value;
});

export function ValidatorSetup(value: any) {
  Reflect.set(Reflect, "MpSimpleStateValidator", value);
  for (const setup of setupList) {
    setup(value);
  }
}
