import { Spin } from "antd";

const Spinner = () => {
  return (
    <>
      <div className="spinner-container">
        <Spin size="large" />
      </div>
      <style>{`
    .spinner-container { display: flex; justify-content: center; align-items: center; height: 100vh; }

    .ant-spin-dot { font-size: 40px; }

    .ant-spin-dot i { background-color: var(--color-stone-light) !important; }
    `}</style>
    </>
  );
};

export default Spinner;
