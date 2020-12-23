import { v4 as Guid } from 'uuid'
import { createContext, useContext } from 'react'
import { IControlRenderProps, IHandlerProps } from '../EosTable/types'

interface IDictionary<T> {
    add(key: string, value: T): void;
    remove(key: string): void;
    getItem(key: string): T | undefined
}

class Dictionary<T> implements IDictionary<T> {
    private items: { [index: string]: T } = {};

    constructor(init?: { key: string; value: T; }[]) {
        if (init) {
            for (let x = 0; x < init.length; x++) {
                this.add(init[x].key, init[x].value)
            }
        }
    }

    add(key: string, value: T) {
        if (!this.containsKey(key))
            this.items[key] = value
    }

    remove(key: string) {
        if (this.containsKey(key))
            delete this.items[key];
    }

    getItem(key: string) {
        return (this.containsKey(key)) ? this.items[key] : undefined
    }

    private containsKey(key: string) {
        return (typeof this.items[key] !== "undefined")
    }
}

interface IProps {
    controls: Dictionary<(controlProps: IControlRenderProps) => JSX.Element>,
    actions: Dictionary<(handlerProps: IHandlerProps) => Promise<void> | void>,
    conditions: Dictionary<(handlerProps: IHandlerProps) => boolean>,
    translation?: (key?: string) => string
}

const init: IProps = {
    controls: new Dictionary<(controlProps: IControlRenderProps) => JSX.Element>(),
    actions: new Dictionary<(handlerProps: IHandlerProps) => Promise<void> | void>(),
    conditions: new Dictionary<(handlerProps: IHandlerProps) => boolean>()
}


export const SCOPE_EOS_COMPONENTS_STORE_GLOBAL = "EosVendor"
export const SCOPE_EOS_COMPONENTS_STORE_CLASSIF = "EosVendorClassif"
const DELIMITER = ":"

const StoreComponentsContext = createContext<IProps>(init);

export type ScopeEosComponentsStore = string

interface IEosComponentsStoreProps {
    global?: boolean
    scope?: ScopeEosComponentsStore
}

export function useEosComponentsStore(props?: IEosComponentsStoreProps) {

    const scopeStore = props?.scope || (props?.global ? SCOPE_EOS_COMPONENTS_STORE_GLOBAL : Guid())

    const context = useContext(StoreComponentsContext)

    function addControlToStore(name: string, control: (controlProps: IControlRenderProps) => JSX.Element) {
        context.controls.add(scopeStore + DELIMITER + name, control);
    }

    function fetchControlFromStore(name: string) {
        return context.controls.getItem(scopeStore + DELIMITER + name)
            || context.controls.getItem(SCOPE_EOS_COMPONENTS_STORE_CLASSIF + DELIMITER + name)
            || context.controls.getItem(SCOPE_EOS_COMPONENTS_STORE_GLOBAL + DELIMITER + name)
    }

    function addActionToStore(name: string, action: (handlerProps: IHandlerProps) => Promise<void> | void) {
        context.actions.add(scopeStore + DELIMITER + name, action);
    }

    function fetchActionFromStore(name: string) {
        return context.actions.getItem(scopeStore + DELIMITER + name)
            || context.actions.getItem(SCOPE_EOS_COMPONENTS_STORE_CLASSIF + DELIMITER + name)
            || context.actions.getItem(SCOPE_EOS_COMPONENTS_STORE_GLOBAL + DELIMITER + name)
    }

    function addConditionToStore(name: string, action: (handlerProps: IHandlerProps) => boolean) {
        context.conditions.add(scopeStore + DELIMITER + name, action);
    }

    function fetchConditionFromStore(name: string) {
        return context.conditions.getItem(scopeStore + DELIMITER + name)
            || context.conditions.getItem(SCOPE_EOS_COMPONENTS_STORE_CLASSIF + DELIMITER + name)
            || context.conditions.getItem(SCOPE_EOS_COMPONENTS_STORE_GLOBAL + DELIMITER + name)
    }

    function localizationCallback(callback: (key?: string) => string) {
        context.translation = callback
    }

    function localize(key?: string) {
        return (key && context.translation) ? context.translation(key) : (key || "");
    }

    return {
        addActionToStore,
        addConditionToStore,
        addControlToStore,
        fetchActionFromStore,
        fetchConditionFromStore,
        fetchControlFromStore,
        localizationCallback,
        localize,
        scopeStore
    }
}
