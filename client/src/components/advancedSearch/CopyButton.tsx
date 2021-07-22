import React, { useState, FC } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Tooltip,
  IconButton,
  Fade,
} from '@material-ui/core';
import { CopyButtonProps } from './Types';

const CopyIcon = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
      stroke="#06AFF2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33301 9.99992H2.66634C2.31272 9.99992 1.97358 9.85944 1.72353 9.60939C1.47348 9.35935 1.33301 9.02021 1.33301 8.66659V2.66659C1.33301 2.31296 1.47348 1.97382 1.72353 1.72378C1.97358 1.47373 2.31272 1.33325 2.66634 1.33325H8.66634C9.01996 1.33325 9.3591 1.47373 9.60915 1.72378C9.8592 1.97382 9.99967 2.31296 9.99967 2.66659V3.33325"
      stroke="#06AFF2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyButton: FC<CopyButtonProps> = props => {
  const { label, icon, className, value, ...others } = props;
  const classes = useStyles();
  const [tooltipTitle, setTooltipTitle] = useState('Copy');

  const handleClick = (v: string) => {
    setTooltipTitle('Copied!');
    navigator.clipboard.writeText(v);
    setTimeout(() => {
      setTooltipTitle('Copy');
    }, 1000);
  };

  return (
    <Tooltip
      title={tooltipTitle}
      arrow
      placement="top"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      className={classes.tooltip}
    >
      <IconButton
        aria-label={label}
        className={`${classes.button} ${className}`}
        onClick={() => handleClick(value || '')}
        {...others}
      >
        {icon || CopyIcon}
      </IconButton>
    </Tooltip>
  );
};

CopyButton.defaultProps = {
  label: 'copy button',
  value: '',
};

CopyButton.displayName = 'CopyButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    button: {},
    tooltip: {},
  })
);

export default CopyButton;
