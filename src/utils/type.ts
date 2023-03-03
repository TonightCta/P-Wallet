
export interface State{
    web3?:any,
    language?:string,
}

export enum Type{
    SET_LANGUAGE = 'set_language',
};

export interface IAction{
    type:string,
    payload:State
}

export interface Context{
    state:State,
    dispatch:(action:IAction) => void
}