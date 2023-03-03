import { React } from "./SimpleReact";
import { SimpleStateEntry, SimpleStateDict } from "../model/SimpleStateEntry";
import { useUpdate, useUpdateBatch } from "./ReactUtil";

export interface ReactSimpleStateControl<T> {
  stateDict: SimpleStateDict,
  stateEntry: SimpleStateEntry<T>,
  update(): void;
}

export class ReactSimpleState {

  static useStateControl<
    T extends object
  >(
    defaultValue: T | (() => T),
  ) {
    const updateBatch = useUpdate();

    const [control] = React.useState(() => {
      const state = typeof defaultValue === "function" ?
        (defaultValue as (() => T))() : defaultValue;
      const stateDict = new SimpleStateDict();
      const stateEntry = SimpleStateEntry.fromCreateSlot(state);

      const stateControl = {
        state,
        stateEntry,
        stateDict,
        update() {
          stateDict.updateEvent.trigger();
        },
      };
      return stateControl;
    });
    React.useEffect(() => {
      return control.stateDict.updateEvent.regist(() => {
        updateBatch();
      });
    }, []);
    return control;
  }

  static useFormProps<T extends object>(
    stateControl: ReactSimpleStateControl<T>,
    options: {
      include?: ((nameJoin: string) => boolean) | string[] | string;
      exclude?: ((nameJoin: string) => boolean) | string[] | string;
    } = {},
  ) {

    const include = (nameJoin: string) => {
      if (typeof options.include === "string") {
        return nameJoin === options.include;
      }
      if (Array.isArray(options.include)) {
        return options.include.includes(nameJoin);
      }
      return !!options.include ? options.include(nameJoin) : false;
    };
    const exclude = (nameJoin: string) => {
      if (typeof options.exclude === "string") {
        return nameJoin === options.exclude;
      }
      if (Array.isArray(options.exclude)) {
        return options.exclude.includes(nameJoin);
      }
      return !!options.exclude ? options.exclude(nameJoin) : false;
    };

    function fieldsMap(
      stateEntry: SimpleStateEntry,
      name: string[] = [],
    ): any[] {
      const nameJoin = name.join(".");
      if (!!options.include && !include(nameJoin)) {
        return [];
      }
      if (!!options.exclude && exclude(nameJoin)) {
        return [];
      }
      const value = stateEntry.data;
      const field = {
        name,
        value,
        validating: stateEntry.validating,
        touched: stateEntry.touched,
        errors: stateEntry.errors.map(a => a.message ?? ""),
      };
      if (
        value === undefined ||
        value === null ||
        typeof value !== "object" ||
        Array.isArray(value) && value.every(a => typeof a !== "object") ||
        (
          typeof Blob !== "undefined" && value instanceof Blob ||
          typeof HTMLInputElement !== "undefined" && value instanceof HTMLInputElement &&
          typeof value === "object" && (!!(value as any).fileHold || !!(value as any).originFileObj)
        )
      ) {
        return [field];
      }
      const childFields = Object.keys(value as any).flatMap(
        k => fieldsMap(
          stateEntry.child(k),
          [...name, k],
        )
      );
      return [
        field,
        ...childFields,
      ];
    }

    const simpleStateEntry = stateControl.stateEntry;
    const [formRaw] = Form.useForm();
    const [form] = React.useState(() => {
      const form = formRaw;
      const fields = fieldsMap(simpleStateEntry);
      form.setFields(fields);
      return form;
    });
    React.useEffect(() => {
      return stateControl.stateDict.updateEvent.regist(() => {
        const fields = fieldsMap(simpleStateEntry);
        form.setFields(fields);
      });
    }, []);
    const props = {
      form,
      onFieldsChange: (_values, fields: any[]) => {
        for (const field of fields) {
          const childStateEntry = field.name.reduce(
            (pre: SimpleStateEntry, cur: string) => pre.child(cur),
            simpleStateEntry,
          );
          childStateEntry.data = field.value;
          childStateEntry.validating = field.validating;
          childStateEntry.touched = field.touched;
          childStateEntry.errors = field.errors.map((message: string) => ({ message, }));
        }
        stateControl.update();
      },
    };
    return props;
  }

}

//应在启动时注入Form的实例
export let Form = Reflect.get(Reflect, "ReactSimpleStateForm");

const setupListImpl = [];
const setupList =
  Reflect.get(Reflect, "ReactSimpleStateFormSetupList") as typeof setupListImpl ||
  (Reflect.set(Reflect, "ReactSimpleStateFormSetupList", setupListImpl), setupListImpl);
setupList.push((value) => {
  Form = value;
});

export function FormSetup(value: any) {
  Reflect.set(Reflect, "ReactSimpleStateForm", value);
  for (const setup of setupList) {
    setup(value);
  }
}
