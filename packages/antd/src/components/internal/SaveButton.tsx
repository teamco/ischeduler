import { SaveOutlined } from '@ant-design/icons';
import { Button, type FormInstance } from 'antd';
import React from 'react';

import { useSchedulerContext } from '@teamco/ischeduler-core';

import type { ButtonColorType, ButtonVariantType } from 'antd/es/button';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

type TSaveButton = {
  formRef?: FormInstance;
  loading?: boolean;
  className?: string;
  isEdit?: boolean;
  disabled?: boolean;
  danger?: boolean;
  size?: SizeType;
  color?: ButtonColorType;
  icon?: React.ReactNode;
  variant?: ButtonVariantType;
  htmlType?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
};

export const SaveButton: React.FC<TSaveButton> = (props) => {
  const { t, permissions } = useSchedulerContext();

  const {
    formRef,
    loading,
    className,
    isEdit,
    disabled,
    size = 'small',
    color = 'primary',
    icon = <SaveOutlined />,
    htmlType = 'submit',
    variant = 'solid',
    onClick,
    danger = false,
  } = props;

  const canPerform = isEdit ? permissions.canUpdate : permissions.canCreate;

  if (!canPerform) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formRef && htmlType === 'submit') {
      formRef.submit();
    }
    onClick?.();
  };

  const label = isEdit ? t('actions.update') : t('actions.save');

  return (
    <Button
      size={size}
      variant={variant}
      htmlType={htmlType}
      className={className}
      disabled={disabled}
      loading={loading}
      icon={icon}
      danger={danger}
      onClick={handleClick}
      color={color}
    >
      {label}
    </Button>
  );
};
