import { ReactElement, ReactNode, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Select, Spin, Popover, Switch } from 'antd';
import { MenuOutlined, SettingOutlined } from '@ant-design/icons'
import { useConnect, useSwitchChain } from '../../utils/hooks'
import './menu.scss'
import { PWallet } from '../../App';
import Jazzicon from 'react-jazzicon';
import MobileMenu from './components/mobile_menu';
import { Type } from '../../utils/type';

interface Route {
    url: string,
    name: string
}

interface Option {
    value: string,
    label: string
}

const Mainnet: Option[] = [
    { value: '2099156', label: 'Plian Mainnet Main' },
    { value: '8007736', label: 'Plian Mainnet Subchain 1' },
]
const Testnet: Option[] = [
    { value: '16658437', label: 'Plian Testnet Main' },
    { value: '10067275', label: 'Plian Testnet Subchain 1' },
]

const MenuTab = (): ReactElement<ReactNode> => {
    const navigate = useNavigate();
    // const { t } = useTranslation();
    const { connect } = useConnect();
    //Current connection address
    const { state, dispatch } = useContext(PWallet);
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
    const [options, setOptions] = useState<Option[]>(state.developer === 1 ? Testnet : Mainnet);
    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setActive(0);
                setIsSet(true)
                break;
            case '/stake':
                setIsSet(false)
                setActive(1);
                break;
            case '/l2':
                setIsSet(false)
                setActive(2);
                break;
            default:
                setIsSet(true)
                setActive(0)
        }
    }, [location.pathname]);
    const [isSet,setIsSet] = useState<boolean>(true);
    const [isDev, setIsDev] = useState<boolean>(false);
    useEffect(() => {
        console.log(state.developer)
        setIsDev(state.developer === 1 ? true : false);
    }, [])
    const onChange = async (value: boolean) => {
        setIsDev(value)
        const result = await switchC(value ? 16658437 : 2099156);
        if (result != null) {
            setIsDev(false)
            return
        };
        setOptions(value ? Testnet : Mainnet)
        dispatch({
            type: Type.SET_DEVELOPER,
            payload: {
                developer: value ? 1 : 0
            }
        })
    }
    const Set = (
        <div className='set-inner'>
            <div className='dev-open'>
                <p>Developer mode</p>
                <Switch checked={isDev} size='small' onChange={onChange} />
            </div>
        </div>
    )
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
                        <div className='balance-text'>Balance&nbsp;:&nbsp;
                            {
                                !state.balance_wait
                                    ? <p>{state.developer === 1 ? state.account_balance?.dev_balance : state.default_chain == '2099156' ? state.account_balance?.main_balance?.toFixed(4) : state.account_balance?.child_balance?.toFixed(4)}</p>
                                    : <Spin size="small" />
                            }&nbsp;Pi&nbsp;&nbsp;($&nbsp;{state.developer === 1 ? '0.0000' :  state.default_chain == '2099156' ? state.account_balance?.main_balance_usdt?.toFixed(4) : state.account_balance?.child_balance_usdt?.toFixed(4)})
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
                            options={options}
                        />
                    </div>
                    {isSet && <div className='setting-box'>
                        {/* Set up */}
                        <Popover placement="bottom" title="Set up" content={Set} trigger="click">
                            <p className='setting-icon icon-oper'>
                                <SettingOutlined style={{ color: 'white', fontSize: 20 }} />
                            </p>
                        </Popover>
                    </div>}
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
