

import { Context, IAction, State,Type } from "../utils/type";
import Web3 from "web3";
import currentProvider from 'web3';

const win:any = window;
const web3Provider = win.ethereum ? win.ethereum : currentProvider;
const web3 =  new Web3(web3Provider);

const balance_default : string = '{"main_balance":0,"main_balance_usdt":0,"child_balance":0,"child_balance_usdt":0}'
const transfer_msg_default : string = '{"from_chin":"","to_chain":"","transfer_type":0}'

export const defaultState : State = {
    web3:web3,//全局web3对象
    language:localStorage.getItem('language') || 'en',//本地语言
    address:localStorage.getItem('address') || null,//当前连接地址
    check_chain:1,//是否在Plian
    default_chain:'2099156',//默认选择链
    account_balance:JSON.parse(sessionStorage.getItem('account_balance') || balance_default),//余额
    balance_wait:false,//余额loading
    // to_chain:'',//转入链
    // from_chain:'',//转出链
    transfer_msg:JSON.parse(sessionStorage.getItem('transfer_msg') || transfer_msg_default),
    waiting:{
        visible:false,
        type:'wait'
    },
    transfer_hash:sessionStorage.getItem('transfer_hash') || '',
    last_transfer_chain:Number(sessionStorage.getItem('last_transfer_chain')) || 0,
    reload_logs:new Date().getTime(),
    l2_active:Number(sessionStorage.getItem('l2_active')) || 999
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
        case Type.SET_BALANCE:
            sessionStorage.setItem('account_balance',JSON.stringify(payload.account_balance))
            return { ...state, account_balance:payload.account_balance}
        case Type.SET_BALANCE_WAIT:
            return { ...state,balance_wait:payload.balance_wait }
        // case Type.SET_TO_CHAIN:
        //     return { ...state,to_chain:payload.to_chain }
        // case Type.SET_FROM_CHAIN:
        //     return { ...state,from_chain:payload.from_chain }
        case Type.SET_TRNASFER_MSG:
            sessionStorage.setItem('transfer_msg',JSON.stringify(payload.transfer_msg))
            return { ...state,transfer_msg:payload.transfer_msg }
        case Type.SET_WAITING:
            return { ...state,waiting:payload.waiting }
        case Type.SET_TRANSFER_HASH:
            sessionStorage.setItem('transfer_hash',payload.transfer_hash as string);
            return { ...state,transfer_hash:payload.transfer_hash }
        case Type.SET_LAST_TRANSFER_CHAIN:
            sessionStorage.setItem('last_transfer_chain',String(payload.last_transfer_chain));
            return { ...state,last_transfer_chain:payload.last_transfer_chain }
        case Type.SET_RELOAD_LOGS:
            return { ...state,reload_logs:payload.reload_logs }
        case Type.SET_L2_ACTIVE:
            sessionStorage.setItem('l2_active',String(payload.l2_active));
            return { ...state,l2_active:payload.l2_active }
        default:
            return state;
    }
};
