import useHistorySlim, { IHistorySlimItem } from "./useHistorySlim";


/**
 * @url - урла, на которую произойдет переход при вызове метода pushCurrentBack.
 * @title - заголовок текущей страницы(формы)
 * @child - информация о предыдущей странице.
 */

export interface IBackInfo {
    url?: string;
    title?: string;
}

export interface IBackUrlHistory {
    push(path: string, state?: IHistorySlimItem): void;
    goBack(): void;
    pushPrevious(path: string, state?: IHistorySlimItem[]): void;
    pushKeepPrevious(path: string): void;
    pushPopPrevious(path: string, state?: IHistorySlimItem | IHistorySlimItem[] | undefined): void;
    getState(): any;
    getPreviousState(): any;
    getStateByName(name: string): any;
    toBack(): void;
}
/**
 * Объект history с проверкой ухода с формый создания/изменения элемента и соответствующим сообщением.
 */
function useBackUrlHistory(): IBackUrlHistory {
    const {
        push: slimPush,
        goBack: slimGoBack,
        pushPrevious: slimPushPrevious,
        pushKeepPrevious: slimPushKeepPrevious,
        pushPopPrevious: slimPushPopPrevious,
        getState: slimGetState,
        getPreviousState: slimGetPreviousState,
        getStateByName: slimGetStateByName
    } = useHistorySlim();
    const stateKey = "backUrl";
    const push = (path: string, state?: IHistorySlimItem): void => {
        slimPush(path, state);
    }
    const goBack = (): void => {
        slimGoBack();
    }
    /**
     * Метод нужно использовать, когда требуется сохранить текущий урл для перехода. Передавать текущий урл не нужно, потому что он сам подставится из истории.
     * @param path - урла куда сейчас сделать редирект
     * @param title - заголовок текущей страницы(формы)
     */
    const pushPrevious = (path: string, state?: IHistorySlimItem[]): void => {
        const backObj = {
            url: window.location.pathname,
            title: document.title
        } as IBackInfo
        let myState: IHistorySlimItem = joinState(backObj, state);
        slimPushPrevious(path, myState);
    }
    /**
     * Метод нужно использовать, когда вы знаете, что вам нужно сохранить бэк урлу, которая уже есть. Например: переход между формами в пределах одной карточки(edit/disp)
     * @param path - урла куда сейчас сделать редирект
     */
    const pushKeepPrevious = (path: string): void => {
        // const state: any = history.location.state;
        slimPushKeepPrevious(path);
    }
    /**
     * Пока не использовался
     * @param path - урла куда сейчас сделать редирект
     * @param title - заголовок текущей страницы(формы)
     */
    const pushPopPrevious = (path: string, state?: IHistorySlimItem | IHistorySlimItem[] | undefined): void => {
        // const state: any = history.location.state;
        const backObj = {
            url: window.location.pathname,
            title: document.title
        } as IBackInfo
        const myState = joinState(backObj, state);
        slimPushPopPrevious(path, myState);
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
        return slimGetPreviousState()
    }
    const getStateByName = (name: string) => {
        return slimGetStateByName(name);
    }
    /**
     * Метод выполняет переход на предыдущую страницу из истории backUrls.
     */
    const toBack = (state?: IHistorySlimItem | IHistorySlimItem[]): void => {
        const currBack = getStateByName(stateKey);
        const myState = joinState(getPreviousState(), state);

        slimPushPopPrevious(currBack.url, myState);
    }

    return { push, goBack, pushPrevious, pushKeepPrevious, pushPopPrevious, getState, getPreviousState, getStateByName, toBack };

    function joinState(backState: IBackInfo, state?: IHistorySlimItem | IHistorySlimItem[]): any {
        let myState;
        if (state) {
            if (Array.isArray(state))
                myState = [backState, ...state];
            else
                myState = [backState, state];
        }
        else
            myState = backState;
        return myState;
    }
}
export default useBackUrlHistory;


