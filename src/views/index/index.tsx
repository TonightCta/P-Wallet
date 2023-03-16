
import { ReactElement, ReactNode, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useBalance } from '../../utils/hooks'
import MenuTab from '../../components/menu/menu';
import './index.scss'
import Footer from './../../components/footer/index';


const IndexView = (): ReactElement<ReactNode> => {
    const location = useLocation();
    const { inquire } = useBalance();
    useEffect(() => {
        inquire()
    },[])
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
            <Footer/>
        </div>
    )
};

export default IndexView;

