import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useHistorySlim, { IHistorySlimState } from "./useHistorySlim";

/**Тип изменения страницы. */
export enum HistoryActionType {
    /**Нет, обычно означает, что была перезагрузка страницы. */
    none = 0,
    /**Шаг вперёд с добавлением в историю браузера новой записи. */
    push = 1,
    /**Шаг назад с выбиванием из истории последней записи и возврат к предыдущей (кнопка браузера "назад"). */
    pop = 2
}

interface IHistoryData {
    redirectType: HistoryActionType
}

let historyData: IHistoryData = { redirectType: HistoryActionType.none };

/**Хук позволяет подписываться на изменение состояния. */
function useHistoryListener(name?: string) {
    const { getState, getStateByName } = useHistorySlim();
    const history = useHistory();
    const [currentState, setCurrentState] = useState<IHistorySlimState | any>(getCurrentState());


    useEffect(() => {
        // const onListen = () => {
        //     setCurrentState(getCurrentState());
        // }
        // history.listen(onListen);
        history.listen(onListen);
    }, []);
    return { currentState, getRedirectType };

    function getCurrentState() {
        if (name === undefined || name === null || name === "")
            return getState()
        else
            return getStateByName(name);
    }
    function onListen(_data: any, redirectType?: "PUSH" | "POP" | string) {
        setCurrentState(getCurrentState());

        let historyActionType: HistoryActionType;
        switch (redirectType) {
            case "PUSH":
                historyActionType = HistoryActionType.push;
                break;
            case "POP":
                historyActionType = HistoryActionType.pop;
                break;
            default:
                historyActionType = HistoryActionType.none;
                break;
        }
        historyData.redirectType = historyActionType;
        // setActionType(historyActionType);
    }
    /**Возвращает тип изменения страницы в следствии которого был переход на текущую. */
    function getRedirectType(): HistoryActionType {
        return historyData.redirectType;
    }
}
export default useHistoryListener;
