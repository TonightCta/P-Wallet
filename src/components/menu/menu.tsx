import { ReactElement, ReactNode, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Select, Spin } from 'antd';
import { MenuOutlined } from '@ant-design/icons'
import { useConnect, useSwitchChain } from '../../utils/hooks'
import './menu.scss'
import { PWallet } from '../../App';
import Jazzicon from 'react-jazzicon';
import MobileMenu from './components/mobile_menu';

interface Route {
    url: string,
    name: string
}

const MenuTab = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    // const { t } = useTranslation();
    const { connect } = useConnect();
    //Current connection address
    const { state } = useContext(PWallet);
    const location = useLocation();
    const [mobildMenu, setMobileMenu] = useState<boolean>(false);
    //Currently selected main network
    const { switchC } = useSwitchChain();
    const handleChange = (value: string) => {
        switchC(Number(value))
    };
    const [active, setActive] = useState<number>(999);
    const route: Route[] = [
        {
            url: '/',
            name: 'Bridge'
        },
        {
            url: '/stake',
            name: 'Stake'
        },
        {
            url: '/l2',
            name: 'L2'
        },
    ];
    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setActive(0);
                break;
            case '/stake':
                setActive(1);
                break;
            case '/l2':
                setActive(2);
                break;
            default:
                setActive(0)
        }
    }, [location.pathname])
    return (
        <div className='menu-box'>
            <div className='menu-inside'>
                <div className='mobile-menu' onClick={() => {
                    setMobileMenu(true)
                }}>
                    <MenuOutlined />
                </div>
                <div className='logo-menu'>
                    <div className={`logo-box ${!state.address ? 'mobile-need-right' : ''}`}>
                        <img src={require('../../assets/images/logo1.png')} alt="" />
                    </div>
                    <ul>
                        {
                            route.map((item: Route, index: number) => {
                                return (
                                    <li className={`${index === active ? 'active-tab' : ''}`} key={index} onClick={() => {
                                        navigate(item.url);
                                    }}>
                                        {item.name}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className='connect-wallet-msg'>
                    <div className='tools-box'>
                        {/* Set up */}
                        {/* <p className='setting-icon icon-oper'>
                            <SettingOutlined style={{ color: 'white', fontSize: 20 }} />
                        </p> */}
                        <div className='balance-text'>Balance&nbsp;:&nbsp;
                            {
                                !state.balance_wait
                                    ? <p>{state.is_dev === 1 ? state.account_balance?.dev_balance : state.default_chain == '2099156' ? state.account_balance?.main_balance?.toFixed(4) : state.account_balance?.child_balance?.toFixed(4)}</p>
                                    : <Spin size="small" />
                            }&nbsp;Pi&nbsp;&nbsp;($&nbsp;{state.default_chain == '2099156' ? state.account_balance?.main_balance_usdt?.toFixed(4) : state.account_balance?.child_balance_usdt?.toFixed(4)})
                        </div>
                        {/* Switch language */}
                        {/* <p className='select-language icon-oper'>
                            <PieChartOutlined style={{ color: 'white', fontSize: 20 }} />
                        </p> */}
                    </div>

                    {/* Choose mainnet */}
                    <div className='select-chain'>
                        <Select
                            size='small'
                            className='mine-select'
                            value={state.default_chain}
                            style={{ width: 200, height: 30 }}
                            onChange={handleChange}
                            options={[
                                { value: '2099156', label: 'Plian Mainnet Main' },
                                // { value: '2099156', label: 'Dev Plian' },
                                { value: '8007736', label: 'Plian Mainnet Subchain 1' },
                            ]}
                        />
                    </div>
                    {/* Connect wallet */}
                    <div className='connect-btn'>
                        <Button type='primary' onClick={() => {
                            (state.address == null || state.address == 'null') && connect()
                        }}>
                            {state.address != null && <div className='avatar'>
                                <Jazzicon diameter={18} seed={parseInt(state.address.slice(2, 10), 16)} />
                            </div>}
                            {(state.address == null || state.address == 'null')
                                ? 'Connect Wallet'
                                : `${state.address.substring(0, 6)}...${state.address.substring(state.address.length - 6, state.address.length)}`
                            }
                        </Button>
                    </div>
                </div>
                <div className='mobile-avatar' onClick={() => {
                    setMobileMenu(true)
                }}>
                    {
                        (state.address == null || state.address == 'null') ? <Button type='primary' size='small'>Connect</Button>
                            : <Jazzicon diameter={24} seed={parseInt(state.address.slice(2, 10), 16)} />
                    }
                </div>
            </div>
            {/* Mobile menu */}
            <MobileMenu visible={mobildMenu} onClose={(val: boolean) => {
                setMobileMenu(val)
            }} />
        </div>
    )
};

export default MenuTab;
