import { Button, Tooltip } from "antd";
import { ReactElement, ReactNode, useState, useContext, useEffect } from "react";
import { PWallet } from './../../../../App';
import { SignAddress } from '../../../../request/api'
import { error } from "../../../../utils";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useChain } from './../../../../utils/hooks';
import FeedBackModal from "../../../../components/feedback";
import { Type } from "../../../../utils/type";

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
        const result: any = await SignAddress({
            from: input.from,
            privateKey: input.private_key
        });
        if (!result.reuslt) {
            error('Private key error')
            return
        };
        setWait(true)
        const params = {
            _pubkey: input.public_key,
            _chainId: input.chain_id,
            _signature: result.result
        }
        const result_rpc = await join(params);
        setWait(false)
        setVisible(true)
        setPass(result_rpc ? true : false);
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
            <FeedBackModal title={`Join ${pass ? 'Success' : 'Failed'}`} visible={visible} pass={pass} retry={() => {
                submitJoin()
            }} />
        </div>
    )
};

export default JoinIndex;