import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useHistorySlim, { IHistorySlimState } from "./useHistorySlim";

/**Хук позволяет подписываться на изменение состояния. */
 function useHistoryListener(name?: string) {
    const { getState, getStateByName } = useHistorySlim();
    const history = useHistory();
    const [currentState, setCurrentState] = useState<IHistorySlimState | any>(getCurrentState());

    useEffect(() => {
        const onListen = () => {
            setCurrentState(getCurrentState());
        }
        history.listen(onListen);
    }, []);
    return { currentState };

    function getCurrentState() {
        if (name === undefined || name === null || name === "")
            return getState()
        else
            return getStateByName(name);
    }
}
export default useHistoryListener;
