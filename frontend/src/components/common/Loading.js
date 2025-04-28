import { Spin } from 'antd';

const Loading = ({ fullScreen = false }) => {
  return (
    <div className={fullScreen ? "loading-fullscreen" : "loading-container"}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;