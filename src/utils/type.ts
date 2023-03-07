
export interface State{
    web3?:any,
    language?:string,
    address?:string | null
}

export enum Type{
    SET_LANGUAGE = 'set_language',
    SET_ADDRESS = 'set_address'
};

export interface IAction{
    type:string,
    payload:State
}

export interface Context{
    state:State,
    dispatch:(action:IAction) => void
}