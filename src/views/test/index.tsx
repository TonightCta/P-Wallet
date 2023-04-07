import { ReactElement, ReactNode,useContext } from "react";
import { PWallet } from "../../App";
import { Type } from "../../utils/type";
import './index.scss';
import i18n from "../../lang/index";
import { useTranslation } from "react-i18next";

const TestView = (): ReactElement<ReactNode> => {
    const win:any = window;
    const { ethereum } = win;
    const { state,dispatch } = useContext(PWallet);
    const { t } = useTranslation();
    // const { send } = useTransfer();
    //Connect wallet
    const contect = async () : Promise<void> => {
        try{
            await ethereum.request({ method: 'eth_requestAccounts' })
        }catch(error:any){
            console.log(error);
        }
    };
    //Check link status
    const checkcontect = () => {
        !ethereum.selectedAddress && alert('Wallet not connected')
    }
    //Transfer
    const testTransfer = () => {
        // send(1,8007736)
    }
    return (
        <div className="test-view">
            <p>
                <button onClick={contect}>
                {/* Connect wallet */}
                {t('public.connect')}
                </button>
            </p>
            <p>
                <button onClick={() => {
                    dispatch({
                        type:Type.SET_LANGUAGE,
                        payload: {
                            language: state.language === 'en' ? 'zh_CN' : 'en'
                        }
                    })
                    i18n.changeLanguage(state.language === 'en' ? 'zh_CN' : 'en');
                }}>{t('public.change')}({t('public.now')}:{state.language})</button>
            </p>
            <p>
                <button onClick={checkcontect}>{t('public.check')}</button>
            </p>
            <div className="to-address">
                {/* <p>TO:{state.to_chain ? state.to_chain : 'wallet not connected'}</p> */}
                <p><input type="text" placeholder="Address" /></p>
            </div>
            <p>
                <button onClick={testTransfer}>Transfer</button>
            </p>
        </div>
    )
};

export default TestView;