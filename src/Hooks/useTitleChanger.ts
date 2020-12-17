// import { useEffect } from "react";

let pageTitle = document.title;

function useTitleChanger() {
    const setPageTitle = (newTitle: string) => {
        pageTitle = newTitle;
        document.title = pageTitle;
    }
    //TODO: Доделать апдейт хука, чтобы апдейтились все, кто использует такой useEffect в своих компонентах.
    // useEffect(() => {

    // }, [pageTitle]);
    return { pageTitle, setPageTitle }

}
export default useTitleChanger;