import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import SearchClientFormPage from "./SearchClientFormPage";
import AjaxClientFormPage from "./AjaxClientFormPage";
import NotFoundPage from "./NotFoundPage";
import { ConfigProvider, Menu } from 'eos-webui-controls';

interface IMenuItem {
    title: string;
    key: string;
    url: string;
}
function getArchivist() {
    return [
        {
            title: "Форма элемента с вкладками",
            key: 'form',
            url: '/form'
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
                <Route exact path="/form" component={AjaxClientFormPage} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    </ConfigProvider >
    , document.getElementById('root'))
