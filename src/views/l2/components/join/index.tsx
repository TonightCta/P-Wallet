import { Button } from "antd";
import { ReactElement, ReactNode, useState, useContext } from "react";
import { PWallet } from './../../../../App';

interface Input {
    from: string,
    public_key: string,
    private_key: string
}

const InputSource: Input = {
    from: '',
    public_key: '',
    private_key: ''
}


const JoinIndex = (): ReactElement<ReactNode> => {
    const { state } = useContext(PWallet)
    const [input, setInput] = useState<Input>({
        ...InputSource,
        from: state.address ? state.address as string : 'Wallet not connected',
    })
    return (
        <div className="join-index public-content">
            <p className="package-title">Join Child Chain</p>
            <div className="public-input">
                <ul>
                    <li>
                        <p className="lable">From</p>
                        <p>
                            <input type="text" readOnly placeholder="Address" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">Pubkey</p>
                        <p>
                            <input type="text" placeholder="Public key" />
                        </p>
                    </li>
                    <li>
                        <p className="lable">BLS Private Key</p>
                        <p>
                            <input type="text" placeholder="Private key" />
                        </p>
                    </li>
                    <li>
                        <Button block type="primary">{'Join'.toUpperCase()}</Button>
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default JoinIndex;