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
    //连接钱包
    const contect = async () : Promise<void> => {
        try{
            await ethereum.request({ method: 'eth_requestAccounts' })
        }catch(error){
            console.log(error)
        }
    };
    //检查链接状态
    const checkcontect = () => {
        console.log(ethereum.selectedAddress);
        !ethereum.selectedAddress && alert('未连接钱包')
    }
    return (
        <div className="test-view">
            <p>
                <button onClick={contect}>
                {/* 连接钱包 */}
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
        </div>
    )
};

export default TestView;