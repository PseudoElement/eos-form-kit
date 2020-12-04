import { useHistory } from "react-router-dom";
import useHistoryWriter from "./useHistoryState";

export interface IHistorySlimItem {
    name: string;
    value?: any;
}

export interface IHistorySlimState {
    current?: any;
    previous?: IHistorySlimState;
}

/**Хук, позволяющий работать с историей браузера.*/
function useHistorySlim() {
    const history = useHistory();
    const { state: historyState, clearState } = useHistoryWriter();
    const push = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        let nextState = createState();
        addCurrent(nextState, state);

        history.push(path, nextState);
    }
    const goBack = () => {
        history.goBack();
    }
    /**
     * Добавляет запись в историю с записью текущего состояния и всех состояний из useHistoryState.
     * Текущее состояния становится предыдущим.
     * @param path 
     * @param state 
     */
    const pushPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        const currentState: IHistorySlimState = history?.location?.state ?? { current: {}, previous: {} };
        if (!currentState.current)
            currentState.current = {};

        if (historyState)
            for (var i in historyState)
                currentState.current[i] = historyState[i];

        let nextState: IHistorySlimState = createState();
        addCurrent(nextState, state);
        addPrevious(nextState, currentState);

        history.push(path, nextState);
        clearState();
    }

    /**
    * Добавляет запись в историю с записью текущего состояния и всех состояний из useHistoryState.
    * Текущее состояния остаётся текущим.
    * @param path 
    * @param state 
    */
    const pushKeepPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        const currentState: IHistorySlimState = history?.location?.state ?? { current: {}, previous: {} };
        if (!currentState.current)
            currentState.current = {};

        if (historyState)
            for (var i in historyState)
                currentState.current[i] = historyState[i];

        addCurrent(currentState, state);

        history.push(path, currentState);
        clearState();
    }
    /**
     * Добавляет запись в историю с записью текущего состояния.
     * Текущее состояние выбивается.
     * @param path 
     * @param state 
     */
    const pushPopPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        const currentState: IHistorySlimState = history?.location?.state ?? { current: {}, previous: {} };
        let nextState: IHistorySlimState = currentState.previous ? currentState.previous : createState();

        if (!nextState.current)
            nextState.current = {};

        if (historyState)
            for (var i in historyState)
                nextState.current[i] = historyState[i];

        addCurrent(nextState, state);

        history.push(path, nextState);
        clearState();
    }

    /**
     * Возвращает текущее состояние.
     */
    const getState = () => {
        const currentState: IHistorySlimState | null = history?.location?.state ?? null;
        return currentState?.current ?? null;
    }

    /**
    * Возвращает из текущего состояния значение по ключу.
    */
    const getStateByName = (name: string) => {
        const currentState: IHistorySlimState | null = history?.location?.state ?? null;
        return currentState?.current ? currentState?.current[name] : undefined;
    }

    /**
     * Возвращает предыдущее состояние.
     */
    const getPreviousState = () => {
        const currentState: IHistorySlimState | null = history?.location?.state ?? null;
        return currentState?.previous?.current ?? null;
    }
    /**
     * Возвращает массив конкретных свойств из истории.
     * @param name ключ объекта который нужно вытащить из истории
     */
    const getStateByNameAsArray = (name: string) => {
        let stateAsArray: any[] = [];
        const currentState: IHistorySlimState | null = history?.location?.state ?? null;
        if (currentState)
            pushStateItems(currentState);
        return stateAsArray.reverse();

        function pushStateItems(myState: IHistorySlimState) {
            if (myState?.current && myState?.current[name])
                stateAsArray.push(myState?.current[name]);
            if (myState.previous)
                pushStateItems(myState.previous);
        }
    }

    const getPathName = () => {
        return history.location.pathname;
    }
    return { push, goBack, pushPrevious, pushKeepPrevious, pushPopPrevious, getState, getPreviousState, getStateByName, getPathName, getStateByNameAsArray };

    function createState(): IHistorySlimState {
        let nextState: IHistorySlimState = {};
        return nextState;
    }
    function addCurrent(state: IHistorySlimState, stateItem?: IHistorySlimItem | IHistorySlimItem[]) {
        if (stateItem) {
            if (!state.current)
                state.current = {};

            if (Object.prototype.toString.call(stateItem) === "[object Array]") {
                const items: IHistorySlimItem[] = stateItem as IHistorySlimItem[];
                for (let item of items) {
                    state.current[item.name] = item.value;
                }
            }
            else {
                const item: IHistorySlimItem = stateItem as IHistorySlimItem;
                state.current[item.name] = item.value;
            }
        }
    }
    function addPrevious(state: IHistorySlimState, previous?: IHistorySlimState) {
        if (previous) {
            if (!state.previous)
                state.previous = {};
            state.previous = previous;
        }
    }


}
export default useHistorySlim;
