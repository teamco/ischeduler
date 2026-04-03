import { CheckCircleOutlined, MinusCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

import { EStatus } from '@teamco/ischeduler-core';

type TStatusTagProps = {
  status: keyof typeof EStatus;
};

export const StatusTag = ({ status }: TStatusTagProps): React.JSX.Element => {
  switch (status) {
    case EStatus.ACTIVE:
      return (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          {status}
        </Tag>
      );
    case EStatus.PROCESSING:
      return (
        <Tag color="processing" icon={<SyncOutlined spin />}>
          {status}
        </Tag>
      );
    case EStatus.DEACTIVATED:
      return (
        <Tag color="default" icon={<MinusCircleOutlined />}>
          {status}
        </Tag>
      );
    default:
      return <Tag color="default">{status}</Tag>;
  }
};
