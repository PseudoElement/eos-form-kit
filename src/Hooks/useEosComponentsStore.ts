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

const StoreComponentsContext = createContext<IProps>(init)

export function useEosComponentsStore() {    
    const context = useContext(StoreComponentsContext)

    function addControlToStore(name: string, control: (controlProps: IControlRenderProps) => JSX.Element) {
        context.controls.add(name, control);
    }

    function fetchControlFromStore(name: string) {
        return context.controls.getItem(name)           
    }

    function addActionToStore(name: string, action: (handlerProps: IHandlerProps) => Promise<void> | void) {
        context.actions.add(name, action);
    }

    function fetchActionFromStore(name: string) {
        return context.actions.getItem(name)           
    }

    function addConditionToStore(name: string, action: (handlerProps: IHandlerProps) => boolean) {
        context.conditions.add(name, action);
    }

    function fetchConditionFromStore(name: string) {
        return context.conditions.getItem(name)            
    }

    function localizationCallback(callback: (key?: string) => string) {
        context.translation = callback
    }

    function localize(key?: string) {
        return (key && context.translation) ? context.translation(key) : (key || "");
    }

    return {
        addActionToStore, ///del
        addConditionToStore, ///del
        addControlToStore, ///del
        fetchActionFromStore,
        fetchConditionFromStore,
        fetchControlFromStore,
        localizationCallback,
        localize
    }
}
