let state: any = {}
function setState(name: string, value: any) {
    state[name] = value;
}
function clearState() {
    for (let i in state)
        delete state[i];
}

/**Хук, позволяющий регистрировать свои данные перед уходом со страницы через hostory.push. */
function useHistoryState() {
    return { state, setState, clearState };
};
export default useHistoryState;

