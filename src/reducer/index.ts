

import { Context, IAction, State,Type } from "../utils/type";
import Web3 from "web3";
import currentProvider from 'web3';

const win:any = window;
const web3Provider = win.ethereum ? win.ethereum : currentProvider;
const web3 =  new Web3(web3Provider);

export const defaultState : State = {
    web3:web3,//全局web3对象
    language:localStorage.getItem('language') || 'en',//本地语言
    address:localStorage.getItem('address') || null,//当前连接地址
    check_chain:1,//是否在Plian
    default_chain:'2099156'
};

export const defaultContext : Context = {
    state:defaultState,
    dispatch:(_:IAction) => {}
}

export const defaultStateInit = (defaultState:State) => {
    return defaultState
}

export const initState = (state:State,action:IAction) => {
    const { type,payload } = action;
    switch(type){
        case Type.SET_LANGUAGE:
            localStorage.setItem('language',payload.language as string);
            return { ...state,language:payload.language }
        case Type.SET_ADDRESS:
            localStorage.setItem('address',payload.address as string);
            return { ...state,address:payload.address }
        case Type.SET_CHECK_CHAIN:
            return { ...state,check_chain:payload.check_chain };
        case Type.SET_DEFAULT_CHAIN:
            return { ...state,default_chain:payload.default_chain }
        default:
            return state;
    }
};
