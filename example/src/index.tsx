import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import SearchClientFormPage from "./SearchClientFormPage";
import AjaxClientFormPage from "./AjaxClientFormPage";
import AjaxClientFormPage2 from "./AjaxClientFormPage2";
import AjaxClientFormApi from "./AjaxClientFormApi";
import NotFoundPage from "./NotFoundPage";
import { ConfigProvider, Menu } from 'eos-webui-controls';
import ArcPage from './Pages/ArcPage';

interface IMenuItem {
    title: string;
    key: string;
    url: string;
}
function getArchivist() {
    return [
        {
            title: "Создание с вкладками",
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
        }
    ];
}

let menuItems: IMenuItem[] = getArchivist();

ReactDOM.render(
    <ConfigProvider>
        <BrowserRouter>
            <Menu mode="horizontal">
                {menuItems.map(item => {
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.url} title={item.title}>{item.title}</Link>
                        </Menu.Item>
                    );
                })}
            </Menu>
            <Switch>
                <Route strict path="/search" component={SearchClientFormPage} />
                <Route exact path="/arc/:mode/:id?" component={ArcPage} />
                <Route exact path="/form/:mode/:id?" component={AjaxClientFormPage} />
                <Route exact path="/form2/:mode/:id?" component={AjaxClientFormPage2} />
                <Route exact path="/form3/:mode/:id?" component={AjaxClientFormApi} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    </ConfigProvider >
    , document.getElementById('root'))
