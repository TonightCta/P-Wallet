import { Button, Modal, message } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { useTransfer } from "../../../../utils/hooks";

interface Props {
  visible: boolean;
  type: number;
  onClose: (val: boolean) => void;
}

const FailedModal = (props: Props): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | string>("");
  const [hash, setHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { takeDepositMain, takeWithdrawChild } = useTransfer();
  const submitResend = async () => {
    if (props.type === 1 && !amount) {
      message.error("Please enter the amount");
      return;
    }
    if (props.type === 0 && +amount < 0) {
      message.error("Please enter the correct amount");
      return;
    }
    if (!hash) {
      message.error("Please enter the transaction hash");
      return;
    }
    setLoading(true);
    const result: any =
      props.type === 1
        ? await takeWithdrawChild(+amount, hash)
        : await takeDepositMain(hash);
    setLoading(false);
    if (!result || result.message) {
      message.error(result.message);
      return;
    }
    message.success(
      "The transaction was sent successfully, please pay attention to the wallet balance."
    );
    setVisible(false);
    props.onClose(false);
    setAmount("");
    setHash("");
  };
  useEffect(() => {
    !!props.visible && setVisible(props.visible);
  }, [props.visible]);
  return (
    <Modal
      title="Resend Transfer"
      className="resend-trasfer-modal"
      open={visible}
      onCancel={() => {
        setVisible(false);
        props.onClose(false);
      }}
      footer={[
        <Button
          onClick={() => {
            setVisible(false);
            props.onClose(false);
          }}
          type="default"
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={submitResend}
        >
          Submit
        </Button>,
      ]}
      okText="Submit"
      onOk={submitResend}
    >
      {props.type === 0 && (
        <div className="public-inp">
          <p className="label">Amount</p>
          <input
            type="number"
            placeholder="Please enter the amount"
            value={amount}
            onWheel={(event) => (event.target as HTMLElement).blur()}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </div>
      )}
      <div className="public-inp">
        <p className="label">Hash</p>
        <input
          type="text"
          placeholder="Please enter the hash"
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
          }}
        />
      </div>
      <div className="remark-box">
        <p>
          <sup>*</sup>Tips
        </p>
        {props.type === 0 && (
          <p className="text">
            This retrieve only for "L2 {`>`} L1", not "L1 {`>`} L2" !
          </p>
        )}
        {props.type === 0 && (
          <p className="text">
            If you retrieve "L1 {`>`} L2" fund, please switch tab to "L2 {`>`}{" "}
            L1".
          </p>
        )}
        {props.type === 1 && (
          <p className="text">
            This retrieve only for "L1 {`>`} L2", not "L2 {">"} L1" !
          </p>
        )}
        {props.type === 1 && (
          <p className="text">
            If you retrieve "L2 {`>`} L1" fund, please switch tab to "L1 {">"}{" "}
            L2".
          </p>
        )}
      </div>
    </Modal>
  );
};
export default FailedModal;
