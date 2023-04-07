import { Button, Tooltip } from "antd";
import { ReactElement, ReactNode, useState, useContext, useEffect } from "react";
import { PWallet } from './../../../../App';
import { SignAddress } from '../../../../request/api'
import { error } from "../../../../utils";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useChain, useConnect } from './../../../../utils/hooks';
import FeedBackModal from "../../../../components/feedback";
import { Type } from "../../../../utils/type";
import axios from "axios";

interface Input {
    from: string,
    chain_id: string,
    public_key: string,
    private_key: string
}

const InputSource: Input = {
    from: '',
    chain_id: '',
    public_key: '',
    private_key: ''
}


const JoinIndex = (): ReactElement<ReactNode> => {
    const { state, dispatch } = useContext(PWallet);
    const [visible, setVisible] = useState<boolean>(false);
    const [pass, setPass] = useState<boolean>(false);
    const { join } = useChain();
    const { connect } = useConnect();
    const [input, setInput] = useState<Input>({
        ...InputSource,
        from: state.address ? state.address as string : 'Wallet not connected',
    });
    const [wait, setWait] = useState<boolean>(false);
    useEffect(() => {
        setInput({
            ...input,
            chain_id: state.last_creat as string
        });
        return () => {
            setInput({
                ...input,
                chain_id: ''
            });
        }
    }, [])
    const submitJoin = async () => {
        if (!state.address) {
            await connect();
        }
        if (!input.chain_id) {
            error('Please enter chain id');
            return
        };
        if (!input.public_key) {
            error('Please enter public key');
            return
        };
        if (!input.private_key) {
            error('Please enter private key');
            return
        };
        setWait(true)
        const result: any = await axios.post('https://mainnet.plian.io/pchain', {
            jsonrpc: '2.0',
            method: 'chain_signAddress',
            params: [
                input.from, `0x${input.private_key}`
            ],
            id: 1
        });
        setWait(false)
        if (result.data.error) {
            error(result.data.error.message)
            return
        };
        const params = {
            _pubkey: state.web3.utils.toHex(input.public_key),
            _chainId: input.chain_id,
            _signature: result.data.result
        }
        const result_rpc = await join(params);
        setWait(false)
        setTimeout(() => {
            setVisible(true)
            setPass(result_rpc ? true : false);
        })
        result_rpc && setInput({
            ...InputSource,
            from: state.address as string
        });
        result_rpc && dispatch({
            type: Type.SET_LAST_CREAT,
            payload: {
                last_creat: ''
            }
        })
    };
    return (
        <div className="join-index public-content">
            <p className="package-title">Join Child Chain</p>
            <div className="public-input">
                <ul>
                    <li>
                        <p className="lable">From</p>
                        <p>
                            <input type="text" value={input.from} readOnly placeholder="Address" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">
                            Chain ID
                            <span>
                                <Tooltip placement="top" title='Must start with a letter (a-z) and contain alphanumerics (lowercase) or underscores.'>
                                    <QuestionCircleOutlined />
                                </Tooltip>
                            </span>
                        </p>
                        <p>
                            <input type="text" value={input.chain_id} onChange={(e) => {
                                setInput({
                                    ...input,
                                    chain_id: e.target.value
                                })
                            }} placeholder="Chain ID" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Pubkey</p>
                        <p>
                            <input type="text" value={input.public_key} onChange={(e) => {
                                setInput({
                                    ...input,
                                    public_key: e.target.value
                                })
                            }} placeholder="Public key" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">BLS Private Key</p>
                        <p>
                            <input type="text" value={input.private_key} onChange={(e) => {
                                setInput({
                                    ...input,
                                    private_key: e.target.value
                                })
                            }} placeholder="Private key" />
                        </p>
                    </li>
                    <li>
                        <Button loading={wait} onClick={() => {
                            submitJoin()
                        }} block type="primary">{'Join'.toUpperCase()}</Button>
                    </li>
                </ul>
            </div>
            <FeedBackModal title={`Join ${pass ? 'Success' : 'Failed'}`} text={pass ? 'already submitted' : sessionStorage.getItem('error_message') || ''} visible={visible} pass={pass} retry={() => {
                submitJoin()
            }} />
        </div>
    )
};

export default JoinIndex;