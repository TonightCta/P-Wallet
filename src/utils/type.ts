
export interface State{
    web3?:any,
    language?:string,
    address?:string | null,
    check_chain?:number,
    default_chain?:string
}

export enum Type{
    SET_LANGUAGE = 'set_language',
    SET_ADDRESS = 'set_address',
    SET_CHECK_CHAIN = 'set_check_chain',
    SET_DEFAULT_CHAIN = 'set_default_chain'
};

export interface IAction{
    type:string,
    payload:State
}

export interface Context{
    state:State,
    dispatch:(action:IAction) => void
}