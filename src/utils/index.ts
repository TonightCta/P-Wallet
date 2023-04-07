import BigNumber from "bignumber.js";
import { message } from 'antd'
//Date conversion
export const DateConvert = (_time: number): string => {
    const date = new Date(_time * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const day = date.getDate();
    const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
    const min = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
    return `${month}/${day}/${year} ${hour}:${min}`
};
//Accuracy Calculation
export const DecimalToHex = (_num: number): string => {
    return new BigNumber(_num).toString(16);
};
//Error thrown
export const error = (_text: string) => {
    message.error(_text)
};
//Blockchain browser query
export const OutSide = (_key:string,_chain_id:number) => {
    window.open(`https://piscan.plian.org/index.html?key=${_key}&chain=${_chain_id}`)
}