
import { ReactElement, ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import MenuTab from '../../components/menu/menu';
import './index.scss'


const IndexView = (): ReactElement<ReactNode> => {
    const location = useLocation();
    return (
        <div className='index-view'>
            <MenuTab />
            <div className='router-view'>
                <TransitionGroup>
                    <CSSTransition key={location.pathname} timeout={1000} classNames="page">
                        <Outlet />
                    </CSSTransition>
                </TransitionGroup>
            </div>
        </div>
    )
};

export default IndexView;