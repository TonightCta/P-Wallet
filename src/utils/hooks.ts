import { message } from "antd";
import { useContext, useEffect } from 'react';
import { PWallet } from "../App";
import { Type } from "./type";


const win: any = window;
const { ethereum } = win;
//连接钱包
export const useConnect = () => {
    const { dispatch } = useContext(PWallet);
    const connectInner = async () : Promise<void> => {
        if (!ethereum) {
            message.warning('Your browser has not installed the wallet');
            return
        };
        try {
            const result = await ethereum.request({ method: 'eth_requestAccounts' });
            dispatch({
                type:Type.SET_ADDRESS,
                payload: {
                    address: result[0]
                }
            })
        } catch (error: any) {
            switch (error.code) {
                case 4001:
                    message.warning('You have deauthorized')
                    break;
                default:
                    message.warning('Network Error')
            }
        };
    };
    return {
        connect: connectInner,
    }
}