import { Ticket, User } from '@acme/shared-models';
import {
  Card,
  Typography,
  Chip,
  CardContent,
  CardActionArea,
  Button,
  CardActions,
  CardHeader,
  IconButton,
  Fade,
  Box,
  makeStyles,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
} from '@material-ui/core';
import Avatar from '@mui/material/Avatar';

import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { Link as RouterLink } from 'react-router-dom';
import AssigneeAvatarMenu from '../assignee-avatar-menu/assignee-avatar-menu';

interface TicketCardProps {
  ticket: Ticket;
  users: User[];
}

const useStyles = makeStyles((theme) => ({
  cardBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0',
    marginBottom: '1rem',
    cursor: 'pointer',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flex: 1,
    height: '100%',
    minHeight: '3rem',
    padding: '1rem',
  },

  cardActions: { height: '100%', margin: 'auto', width: '3em' },
  cardActionsArea: {
    display: 'flex',
    '&:hover $focusHighlight': {
      opacity: 0,
    },
  },
  cardAvatar: { margin: 'auto', width: '3em', height: '3em', color: 'red' },
  cardHeader: {
    height: '100%',
    margin: 'auto',
    width: '3em',
    padding: '.5rem',
  },
  focusHighlight: {},
}));

const TicketCard = ({ ticket, users }: TicketCardProps) => {
  const [cardHovered, setCardHovered] = useState(false);
  const { fetchData: updateCompleted } = useFetch(
    `/api/tickets/${ticket.id}/complete`
  );

  const classes = useStyles();
  const cardFontStyles = {
    textDecoration: ticket.completed ? 'line-through' : 'none',
    color: ticket.completed ? 'lightgrey' : 'black',
  };

  const handleSetCompleted = () => {
    ticket.completed = !ticket.completed;
    if (ticket.completed) {
      updateCompleted({ method: 'PUT' });
    }
    if (!ticket.completed) {
      updateCompleted({ method: 'DELETE' });
    }
  };

  return (
    <Card
      className={classes.cardBox}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
      style={{
        ...cardFontStyles,
      }}
    >
      <Box className={classes.cardHeader}>
        <AssigneeAvatarMenu ticket={ticket} users={users} />
      </Box>
        <CardActionArea
          component={RouterLink}
          to={`/${ticket.id}`}
          classes={{
            root: classes.cardActionsArea,
            focusHighlight: classes.focusHighlight,
          }}
        >
          <CardContent className={classes.cardContent}>
            <Typography variant="body1">{ticket.description}</Typography>
          </CardContent>
        </CardActionArea>

      <CardActions className={classes.cardActions}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="100%"
          width="100%"
        >
          <Fade in={cardHovered} timeout={200}>
            <Checkbox
              checked={ticket.completed}
              onChange={(e) => handleSetCompleted()}
            />
          </Fade>
        </Box>
      </CardActions>
    </Card>
  );
};

export default TicketCard;
