import useHistorySlim, { IHistorySlimItem } from "./useHistorySlim";


/**
 * @url - урла, на которую произойдет переход при вызове метода pushCurrentBack.
 * @title - заголовок текущей страницы(формы)
 * @child - информация о предыдущей странице.
 */

/**
 * Объект, который будет храниться в window.history
 */
export interface IBackPageInfo {
    url?: string;
    title?: string;
}


export interface IBackUrlHistory {
    push(path: string, state?: IHistorySlimItem): void;
    goBack(): void;
    pushRecover(key: number, path?: string): void
    pushPrevious(path: string, state?: IHistorySlimItem | IHistorySlimItem[]): void;
    pushKeepPrevious(path: string): void;
    pushPopPrevious(path: string, state?: IHistorySlimItem | IHistorySlimItem[] | undefined): void;
    getState(): any;
    getPreviousState(): any;
    getStateByName(name: string): any;
    getBackPageStateAsArray(): any[];
    getBackPageInfoStateByKey(key: number): IBackPageInfo | null;

    toBack(): void;
}
/**
 * Хук, который работает на основе хука useHistorySlim и записываеть объект IBackUrlHistoryObject в историю
 */
function useBackUrlHistory(safeBackUrl?: string): IBackUrlHistory {
    const {
        push: slimPush,
        goBack: slimGoBack,
        pushRecover: slimPushRecover,
        pushPrevious: slimPushPrevious,
        pushKeepPrevious: slimPushKeepPrevious,
        pushPopPrevious: slimPushPopPrevious,
        getState: slimGetState,
        getPreviousState: slimGetPreviousState,
        getStateByName: slimGetStateByName,
        getPathName: slimGetPathName,
        getStateByNameAsArray: slimGetStateByNameAsArray,
        getStateByKey: slimGetStateByKey,
    } = useHistorySlim();
    const backStateName = "backPageInfo";
    /**
    * Дублирует метод push у хука useHistorySlim
    */
    const push = (path: string, state?: IHistorySlimItem): void => {
        slimPush(path, state);
    }
    /**
    * Дублирует метод goBack у хука useHistorySlim
    */
    const goBack = (): void => {
        slimGoBack();
    }
    /**
     * Дублирует метод pushRecover у хука useHistorySlim, только подпихивая свою урлу на которую нужно перейти.
     */
    const pushRecover = (key: number, path?: string): void => {
        let myPath = null;
        if (path)
            myPath = path;
        else {
            const state = slimGetStateByKey(key);
            myPath = state?.current && state?.current[backStateName] ? state?.current[backStateName].url : null;
        }
        slimPushRecover(key, myPath);
    }
    /**
    * Дублирует метод pushPrevious у хука useHistorySlim и кладет в историю объект IBackUrlHistoryObject
    */
    const pushPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]): void => {
        const backObj = {
            url: slimGetPathName(),
            title: document.title
        } as IBackPageInfo;

        let myState: IHistorySlimItem = joinState(backObj, state);
        slimPushPrevious(path, myState);

    }
    /**
    * Дублирует метод pushKeepPrevious у хука useHistorySlim
    */
    const pushKeepPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]) => {
        // const state: any = history.location.state;
        slimPushKeepPrevious(path, state);
    }

    /**
    * Дублирует метод pushPopPrevious у хука useHistorySlim
    */
    const pushPopPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[]): void => {
        slimPushPopPrevious(path, state);
    }

    /**
     * Дублирует метод getState у хука useHistorySlim
     */
    const getState = () => {
        return slimGetState();
    }
    /**
     * Дублирует метод getPreviousState у хука useHistorySlim
     */
    const getPreviousState = () => {
        return slimGetPreviousState();
    }
    /**
     * Дублирует метод getStateByName у хука useHistorySlim
     */
    const getStateByName = (name: string) => {
        return slimGetStateByName(name);
    }
    /**
     * Метод выполняет переход на предыдущую страницу из истории backUrls.
     */
    const toBack = (state?: IHistorySlimItem | IHistorySlimItem[]): void => {
        const currBack = getStateByName(backStateName);
        if (currBack && currBack.url)
            slimPushPopPrevious(currBack.url, state);
        else {
            if (safeBackUrl)
                slimPushPopPrevious(safeBackUrl, state);
            else
                slimPushPopPrevious("/", state);
        }
    }
    /**
     * Возвращает массив объектов IBackUrlHistoryObject
     */
    const getBackPageStateAsArray = (): any[] => {
        return slimGetStateByNameAsArray(backStateName);
    }

    const getBackPageInfoStateByKey = (key: number): IBackPageInfo | null => {
        const state = slimGetStateByKey(key);
        if (state?.current && state?.current[backStateName])
            return state[backStateName];
        return null;
    }


    return {
        push,
        goBack,
        pushRecover,
        pushPrevious,
        pushKeepPrevious,
        pushPopPrevious,
        getState,
        getPreviousState,
        getStateByName,
        getBackPageStateAsArray,
        getBackPageInfoStateByKey,
        toBack,
    };

    function joinState(backState: IBackPageInfo, state?: IHistorySlimItem | IHistorySlimItem[]): any {
        let myState;
        let backStateSlim: IHistorySlimItem = { name: backStateName, value: backState }
        if (state) {
            if (Array.isArray(state))
                myState = [backStateSlim, ...state];
            else
                myState = [backStateSlim, state];
        }
        else
            myState = backStateSlim;
        return myState;
    }
}
export default useBackUrlHistory;


