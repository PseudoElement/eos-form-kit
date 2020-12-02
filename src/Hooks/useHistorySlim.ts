import { useHistory } from "react-router-dom";
import useHistoryState from "./useHistoryState";

export interface IHistorySlimItem {
    name: string;
    value?: any;
}

interface IState {
    current?: any;
    previous?: IState;
}
/**Хук, позволяющий работать с историей браузера.*/
function useHistorySlim() {
    const history = useHistory();
    const { state: historyState, clearState } = useHistoryState();


    const push = (path: string, state?: IHistorySlimItem) => {
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
    const pushPrevious = (path: string, state?: IHistorySlimItem) => {
        const currentState: IState = history?.location?.state ?? { current: {}, previous: {} };
        if (!currentState.current)
            currentState.current = {};

        if (historyState)
            for (var i in historyState)
                currentState.current[i] = historyState[i];

        let nextState: IState = createState();
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
    const pushKeepPrevious = (path: string, state?: IHistorySlimItem) => {
        const currentState: IState = history?.location?.state ?? { current: {}, previous: {} };
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
    const pushPopPrevious = (path: string, state?: IHistorySlimItem) => {
        const currentState: IState = history?.location?.state ?? { current: {}, previous: {} };
        let nextState: IState = currentState.previous ? currentState.previous : createState();

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
        const currentState: IState | null = history?.location?.state ?? null;
        return currentState?.current ?? null;
    }

    /**
     * Возвращает предыдущее состояние.
     */
    const getPreviousState = () => {
        const currentState: IState | null = history?.location?.state ?? null;
        return currentState?.previous?.current ?? null;
    }

    return { push, goBack, pushPrevious, pushKeepPrevious, pushPopPrevious, getState, getPreviousState };

    function createState(): IState {
        let nextState: IState = {};
        return nextState;
    }
    function addCurrent(state: IState, stateItem?: IHistorySlimItem) {
        if (stateItem) {
            if (!state.current)
                state.current = {};
            state.current[stateItem.name] = stateItem.value;
        }
    }
    function addPrevious(state: IState, previous?: IState) {
        if (previous) {
            if (!state.previous)
                state.previous = {};
            state.previous = previous;
        }
    }


}
export default useHistorySlim;
