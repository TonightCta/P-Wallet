

import { Context, IAction, State,Type } from "../utils/type";
import Web3 from "web3";
import currentProvider from 'web3';

const win:any = window;
const web3Provider = win.ethereum ? win.ethereum : currentProvider;
const web3 =  new Web3(web3Provider);

export const defaultState : State = {
    web3:web3,
    language:localStorage.getItem('language') || 'en',
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
        default:
            return state;
    }
};
