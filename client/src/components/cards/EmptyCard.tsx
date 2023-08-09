import { FC } from 'react';
import {
  makeStyles,
  Theme,
  Typography,
  Card,
  CardContent,
} from '@material-ui/core';
import StatusIcon from '../status/StatusIcon';
import { ChildrenStatusType } from '../status/Types';
import { EmptyCardProps } from './Types';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    textAlign: 'center',
  },
  text: {
    marginTop: theme.spacing(2),
    fontSize: '36px',
    lineHeight: '42px',
    color: theme.palette.attuGrey.dark,
    fontWeight: 'bold',
    letterSpacing: '-0.02em',
  },
  subText: {
    fontSize: '18px',
    marginTop: theme.spacing(1),
    color: theme.palette.attuGrey.dark,
  },
}));

const EmptyCard: FC<EmptyCardProps> = ({
  icon,
  text,
  wrapperClass = '',
  subText = '',
  loading = false,
}) => {
  const classes = useStyles();

  return (
    <Card
      className={`flex-center card-wrapper ${classes.wrapper} ${wrapperClass}`}
    >
      <CardContent>
        {loading && <StatusIcon type={ChildrenStatusType.CREATING} size={40} />}
        {icon}
        <Typography className={classes.text}>{text}</Typography>
        <Typography className={classes.subText}>{subText}</Typography>
      </CardContent>
    </Card>
  );
};

export default EmptyCard;
