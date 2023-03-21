
export interface Transfer {
    from_chain: string,
    to_chain: string,
    transfer_type: number
}
export interface Wait {
    visible: boolean,
    type: string
}
export interface Balance {
    main_balance: number,
    main_balance_usdt: number,
    child_balance: number,
    child_balance_usdt: number,
    dev_balance:number
}
export interface State {
    web3?: any,
    language?: string,
    address?: string | null,
    check_chain?: number,
    default_chain?: string,
    account_balance?: Balance,
    balance_wait?: boolean,
    // to_chain?:string,
    // from_chain?:string,
    transfer_msg?: Transfer,
    waiting?: Wait,
    transfer_hash?: string,
    last_transfer_chain?: number,
    reload_logs?: number,
    l2_active?: number,
    last_creat?: string,
    is_wallet?: number,
    reward_total?:number,
    is_dev?:number
}

export enum Type {
    SET_LANGUAGE = 'set_language',
    SET_ADDRESS = 'set_address',
    SET_CHECK_CHAIN = 'set_check_chain',
    SET_DEFAULT_CHAIN = 'set_default_chain',
    SET_BALANCE = 'set_balance',
    SET_BALANCE_WAIT = 'set_balance_wait',
    // SET_TO_CHAIN = 'set_to_chain',
    // SET_FROM_CHAIN = 'set_from_chain'
    SET_TRNASFER_MSG = 'set_transfer_msg',
    SET_WAITING = 'set_waiting',
    SET_TRANSFER_HASH = 'set_transfer_hash',
    SET_LAST_TRANSFER_CHAIN = 'set_last_transfer_chain',
    SET_RELOAD_LOGS = 'set_reload_logs',
    SET_L2_ACTIVE = 'set_l2_active',
    SET_LAST_CREAT = 'set_last_creat',
    SET_IS_WALLET = 'set_is_wallet',
    SET_REWARD_TOTAL = 'set_rewark_total',
    SET_IS_DEV = 'set_is_dev'
};

export interface IAction {
    type: string,
    payload: State
}

export interface Context {
    state: State,
    dispatch: (action: IAction) => void
}

export interface IResponse {
    code: number,
    data: any,
    message: string
}

// 跨链gas
export const gas: number = 42000
export const gasPrice: number = 2000000000