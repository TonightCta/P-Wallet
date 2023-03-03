import { ReactElement } from 'react';
import { Routes, Route } from "react-router-dom";
import * as View from '../views/view';
import './index.css'

const RouterConfig = (): ReactElement => {
    return (
        <Routes>
            <Route path='/' element={<View.IndexView />}>
                <Route index element={<View.WalletView />}></Route>
                <Route path='/test' element={<View.TestView />}></Route>
            </Route>
        </Routes>
    )
};

export default RouterConfig;