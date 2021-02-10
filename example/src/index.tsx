import './index.css'

import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SearchClientFormPage from "./SearchClientFormPage";
import AjaxClientFormPage from "./AjaxClientFormPage";
import AjaxClientFormPage2 from "./AjaxClientFormPage2";
import AjaxClientFormApi from "./AjaxClientFormApi";
import NotFoundPage from "./NotFoundPage";
import { ConfigProvider } from 'eos-webui-controls';
import { EosComponentsProvider, useBackUrlHistory, useHistoryListener, useTitleChanger } from 'eos-webui-formgen';
import ArcPage from './Pages/ArcPage';
import TestPage from './Pages/Test';
import LookupPage from './Pages/LookupPage';
import { TableExample } from './Table';
import { TableSmevMessageQueue } from './TableSmevMessageQueue';

interface IMenuItem {
    title: string;
    key: string;
    url: string;
}
function getArchivist() {
    return [
        {
            title: "Создание с вкладками ",
            key: 'formNew',
            url: '/form/new'
        },
        {
            title: "АРК new",
            key: 'arkNew',
            url: '/arc/new'
        },
        {
            title: "АРК edit",
            key: 'arkEdit',
            url: '/arc/edit/1'
        },
        {
            title: "АРК disp",
            key: 'arkDisp',
            url: '/arc/disp/1'
        },
        {
            title: "Изменение 1 с вкладками",
            key: 'formEdit',
            url: '/form/edit/1'
        },
        {
            title: "Просмотр 1 с вкладками",
            key: 'formDisp',
            url: '/form/disp/1'
        },
        {
            title: "Изменение 2 с вкладками",
            key: 'formEdit2',
            url: '/form/edit/2'
        },
        {
            title: "Просмотр 2 с вкладками",
            key: 'formDisp2',
            url: '/form/disp/2'
        },
        {
            title: "Апи формы",
            key: 'formDisp3',
            url: '/form3/edit/1'
        },
        {
            title: "Просмотр без шапки",
            key: 'formDisp3',
            url: '/form2/disp/1'
        },
        {
            title: "Изменение без шапки",
            key: 'formEdit3',
            url: '/form2/edit/1'
        },
        {
            title: "Форма поиска",
            url: '/search',
            key: 'search',
        },
        {
            title: "Таблица",
            url: '/table',
            key: 'table',
        },
        {
            title: "Таблица СМЭВ Очередь сообщений",
            url: '/tableSmevMessageQueue',
            key: 'tableSmevMessageQueue',
        }
    ];
}

let menuItems: IMenuItem[] = getArchivist();

interface IMainMenu {
    items: IMenuItem[];
}
const MainMenu: FunctionComponent<IMainMenu> = (props: IMainMenu) => {
    const { toBack, getBackPageStateAsArray, pushRecover } = useBackUrlHistory()
    const backStory: any[] = getBackPageStateAsArray();

    let { pageTitle } = useTitleChanger();
    // useEffect(() => {
    //     console.log(pageTitle);
    // }, [pageTitle])

    return (
        // <Menu mode="horizontal">
        <div>
            {props.items.map(item => {
                return (
                    <MainMenuItem title={item.title} url={item.url} />
                    // <Menu.Item key={item.key}>
                    //     <a href={item.url} onClick={() => { pushPrevious(item.url); return false; }}>{item.title}</a>
                    //     {/* <Link to={item.url} title={item.title}>{item.title}</Link> */}
                    // </Menu.Item>
                );
            })}

            <a href={"/"}
                onClick={(event) => {
                    toBack();
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                }}>Назад useBackUrlHistory.toBack</a>
            {/* </Menu> */}
            {backStory && backStory.length > 0 ? (<div>{backStory.map(item => {
                return (<div style={{ display: "inline-block", marginRight: 10, border: "1px solid green " }}><a href={item.state.url} onClick={(event) => {
                    pushRecover(item.key);
                    event.preventDefault();
                }}>{item.state.title}</a></div>);
            })}</div>) : (<></>)}
            <div>{pageTitle}</div>
        </div>
    );
}

interface IMainMenuItem {
    url: string;
    title: string;
}
const MainMenuItem: FunctionComponent<IMainMenuItem> = (props: IMainMenuItem) => {
    const { pushPrevious, getBackPageStateAsArray } = useBackUrlHistory();
    const { currentState } = useHistoryListener();
    return (
        <div style={{ display: "inline-block", marginRight: 10, border: "1px solid #ebacca" }}>
            <a href={props.url} onClick={(event) => {
                // pushPrevious(props.url, { name: "page", value: `Переход в "${props.title}"` });
                // pushKeepPrevious(props.url, { name: "page", value: `Переход в "${props.title}"` });
                pushPrevious(props.url, { name: "page", value: `Переход в "${props.title}"` });
                console.log(currentState);
                const backStory = getBackPageStateAsArray();
                console.log(backStory);
                event.preventDefault();
                event.stopPropagation();
                return false;
            }}>{props.title}</a>
            {/* <Link to={props.url} title={props.title}>{props.title}</Link> */}
        </div>
    );
}



ReactDOM.render(
    <ConfigProvider>
        <EosComponentsProvider>
            <BrowserRouter>
                <MainMenu items={menuItems} />
                <Switch>
                    <Route strict path="/search" component={SearchClientFormPage} />
                    <Route exact path="/test" component={TestPage} />
                    <Route exact path="/arc/:mode/:id?" component={ArcPage} />
                    <Route exact path="/form/:mode/:id?" component={AjaxClientFormPage} />
                    <Route exact path="/form2/:mode/:id?" component={AjaxClientFormPage2} />
                    <Route exact path="/form3/:mode/:id?" component={AjaxClientFormApi} />
                    <Route exact path="/table" component={TableExample} />
                    <Route exact path="/tableSmevMessageQueue" component={TableSmevMessageQueue} />
                    <Route exact path="/lookupPage" component={LookupPage} />
                    <Route path="*" component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
        </EosComponentsProvider>
    </ConfigProvider >
    , document.getElementById('root'));



