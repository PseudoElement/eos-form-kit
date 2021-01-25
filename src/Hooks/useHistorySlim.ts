import { useHistory } from "react-router-dom";
import useHistoryWriter from "./useHistoryState";

export interface IHistorySlimItem {
    name: string;
    value?: any;
}

export interface IHistorySlimState {
    current?: any;
    previous?: IHistorySlimState;
    key: number;
}

/**Хук, позволяющий работать с историей браузера.*/
function useHistorySlim() {
    let counter = 1;
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
     * Возвращает по ключу к определенному состоянию
     * @param key ключ истории к которому нужно вернуться.
     */
    const pushRecover = (key: number, path?: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        const currentState = getStateByKey(key);
        const myPath = path ? path : "/";

        let nextState = currentState?.previous ? currentState?.previous : createState();
        addCurrent(nextState, state);

        // Нужно передавать предыдущее состояние, потому что в нем хранится правильная информация о предыдущей странице.
        // history.push(myPath, currentState?.previous);
        history.push(myPath, nextState);
    }
    /**
     * Добавляет запись в историю с записью текущего состояния и всех состояний из useHistoryState.
     * Текущее состояния становится предыдущим.
     * @param path 
     * @param state 
     */
    const pushPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        const currentState: IHistorySlimState = history?.location?.state as IHistorySlimState ?? createState();
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
        const currentState: IHistorySlimState = history?.location?.state as IHistorySlimState ?? createState();
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
        const currentState: IHistorySlimState = history?.location?.state as IHistorySlimState ?? createState();
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
        const currentState: IHistorySlimState | null = history?.location?.state as IHistorySlimState ?? null;
        return currentState?.current ?? null;
    }

    /**
    * Возвращает из текущего состояния значение по ключу.
    */
    const getStateByName = (name: string) => {
        const currentState: IHistorySlimState | null = history?.location?.state as IHistorySlimState ?? null;
        return currentState?.current ? currentState?.current[name] : undefined;
    }
    const getStateByKey = (key: number) => {
        const currentState: IHistorySlimState | null = history?.location?.state as IHistorySlimState ?? null;
        return key ? getState(currentState) : null;

        function getState(state?: IHistorySlimState): IHistorySlimState | null {
            let result = null;
            if (state) {
                if (state.key === key)
                    result = state;
                else
                    result = getState(state.previous)
            }
            return result;

        }
    }
    /**
     * Возвращает предыдущее состояние.
     */
    const getPreviousState = () => {
        const currentState: IHistorySlimState | null = history?.location?.state as IHistorySlimState ?? null;
        return currentState?.previous?.current ?? null;
    }
    /**
     * Возвращает массив конкретных свойств из истории.
     * @param name ключ объекта который нужно вытащить из истории
     */
    const getStateByNameAsArray = (name: string) => {
        let stateAsArray: any[] = [];
        const currentState: IHistorySlimState | null = history?.location?.state as IHistorySlimState ?? null;
        if (currentState)
            pushStateItems(currentState);
        return stateAsArray.reverse();

        function pushStateItems(myState: IHistorySlimState) {
            if (myState?.current && myState?.current[name])
                stateAsArray.push({ state: { ...myState?.current[name] }, key: myState.key });
            if (myState.previous)
                pushStateItems(myState.previous);
        }
    }

    const getPathName = () => {
        return history.location.pathname;
    }
    return { push, goBack, pushRecover, pushPrevious, pushKeepPrevious, pushPopPrevious, getState, getPreviousState, getStateByName, getPathName, getStateByNameAsArray, getStateByKey };

    function createState(): IHistorySlimState {
        let nextState: IHistorySlimState = {} as IHistorySlimState;
        /**
         * Уникальный ключ. Возвращает количество миллисекунд с 1 января 1970 года.
         * https://www.w3schools.com/jsref/jsref_valueof_date.asp
         */
        nextState.key = new Date().valueOf() + counter++;
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
                state.previous = createState();
            state.previous = previous;
        }
    }


}
export default useHistorySlim;
