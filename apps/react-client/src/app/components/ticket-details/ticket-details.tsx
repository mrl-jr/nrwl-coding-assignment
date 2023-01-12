import { Ticket, User } from '@acme/shared-models';
import {
  Box,
  CircularProgress,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Chip, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import AssigneeAvatarMenu from '../assignee-avatar-menu/assignee-avatar-menu';
import styles from './ticket-details.module.css';

/* eslint-disable-next-line */
export interface TicketDetailsProps {}

const useStyles = makeStyles((theme) => ({
  container: {},
  notFoundMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
}));

export function TicketDetails(props: TicketDetailsProps) {
  const classes = useStyles();
  const [ticket, setTicket] = useState<Ticket>();
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);

  const {
    data: ticketResponse,
    loading: ticketLoading,
    fetchData: fetchTicket,
    error: ticketError,
  } = useFetch(`/api/tickets/${id}`);
  const {
    data: usersResponse,
    fetchData: fetchUsers,
    loading: usersLoading,
  } = useFetch(`/api/users`);

  useEffect(() => {
    fetchTicket({ method: 'GET' });
  }, []);

  useEffect(() => {
    if (ticketResponse) {
      setTicket(ticketResponse);
    }
  }, [ticketResponse]);

  useEffect(() => {
    if (usersResponse) {
      setUsers(usersResponse);
    }
  }, [usersResponse]);

  useEffect(() => {
    if (ticket) {
      fetchUsers({ method: 'GET' });
    }
  }, [ticket]);

  const { fetchData: updateCompleted } = useFetch(
    `/api/tickets/${id}/complete`
  );

  const handleSetCompleted = () => {
    if (!ticket) {
      return;
    }
    ticket.completed = !ticket.completed;
    if (ticket.completed) {
      updateCompleted({ method: 'PUT' });
    }
    if (!ticket.completed) {
      updateCompleted({ method: 'DELETE' });
    }
  };

  if (ticketLoading || usersLoading) {
    return <CircularProgress />;
  }

  return (
    <Container className={classes.container} maxWidth="sm">
      {ticketError && (
        <Typography
          className={classes.notFoundMessage}
          variant="h4"
          component="h4"
        >
          Ticket Not Found
        </Typography>
      )}
      {ticket!! && !ticketError && (
        <Stack direction="column" spacing="2">
          <Stack direction="row" spacing="1" justifyContent="space-between">
            <Typography variant="h6" component="h5" gutterBottom>
              {`ID: ${ticket.id}`}
            </Typography>
            {users && users.length > 0 && (
              <Typography variant="h5" component="h5" gutterBottom>
                <AssigneeAvatarMenu ticket={ticket} users={users} />
              </Typography>
            )}
          </Stack>
          <Stack direction="column">
            <Typography variant="h5" component="h3" gutterBottom>
              {ticket.description}
            </Typography>
            <Chip
              style={{ maxWidth: '5rem', color: 'white' }}
              label={ticket.completed ? 'Done' : 'To Do'}
              color={ticket.completed ? 'success' : 'secondary'}
              onClick={() => handleSetCompleted()}
            />
          </Stack>
        </Stack>
      )}
    </Container>
  );
}

export default TicketDetails;
