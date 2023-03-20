import { Spin } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { BlockInfo, EpochInfo } from "../../../../../request/api";

interface Info {
    v: string,
    b: string,
    e: string
};

const InfoSource: Info = {
    v: '',
    b: '',
    e: ''
}

const OverviewData = (props: { default_chain: string,web3:any }): ReactElement => {
    const [info, setInfo] = useState<Info>(InfoSource);
    const getInfo = async () => {
        const ID: number = props.default_chain === '2099156' ? 0 : 1
        const block = await BlockInfo({
            chainId: ID
        });
        const epoch: any = await EpochInfo({
            chainId: ID
        });
        setInfo({
            v: epoch.validators.length,
            b: block.data.number,
            e: props.web3.utils.hexToNumber(epoch.data[0].number)
        });
    };
    useEffect(() => {
        setInfo(InfoSource)
        getInfo();
    }, [props.default_chain])
    return (
        <div className="overview-data">
            <ul>
                <li>
                    <p>Validators</p>
                    <div className="value">
                        {
                            info.v ? <p>{info.v}</p> : <Spin />
                        }
                    </div>
                </li>
                <li>
                    <p>Latest Block</p>
                    <div className="value">
                        {
                            info.b ? <p>{info.b}</p> : <Spin />
                        }
                    </div>
                </li>
                <li>
                    <p>Epoch</p>
                    <div className="value">
                        {
                            info.e ? <p>{info.e}</p> : <Spin />
                        }
                    </div>
                </li>
            </ul>
        </div>
    )
};

export default OverviewData;