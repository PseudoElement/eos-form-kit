import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import SearchClientFormPage from "./SearchClientFormPage";
import AjaxClientFormPage from "./AjaxClientFormPage";
import NotFoundPage from "./NotFoundPage";
import { ConfigProvider } from 'eos-webui-controls';

ReactDOM.render(
    <ConfigProvider>
        <BrowserRouter>
            <Switch>
                <Route strict path="/search" component={SearchClientFormPage} />
                <Route exact path="/form" component={AjaxClientFormPage} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </BrowserRouter>
    </ConfigProvider>
    , document.getElementById('root'))
