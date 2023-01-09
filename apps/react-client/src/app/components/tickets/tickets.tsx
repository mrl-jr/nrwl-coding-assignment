import { Ticket } from '@acme/shared-models';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  List,
  makeStyles,
} from '@material-ui/core';
import TicketCard from '../ticket-card/ticket-card';
import AddIcon from '@mui/icons-material/Add';
import useFetch from '../../hooks/useFetch';
import { useEffect, useState } from 'react';
import CreateTicketModal from '../create-ticket-modal/create-ticket-modal';
import { autocompleteClasses, Checkbox } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  cardListBox: {
    height: '100%',
    maxWidth: '40em',
    minWidth: '10em',
    width: '-webkit-fill-available',
    display: 'flex',
    flexDirection: 'column',
    padding: '2em',
  },
  addCardButton: {
    width: '100%',
    textAlign: 'left',
    justifyContent: 'left',
    textTransform: 'none',
  },
}));

export function Tickets() {
  const classes = useStyles();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [createTicketModalOpen, setCreateTicketModalOpen] = useState(false);
  const [visibleStatuses, setVisibleStatuses] = useState<string[]>([
    'open',
    'closed',
  ]);
  const [users, setUsers] = useState([]);

  const {
    data: ticketsResponse,
    loading: ticketsLoading,
    fetchData: fetchTickets,
  } = useFetch('/api/tickets');

  const {
    data: usersResponse,
    fetchData: fetchUsers,
    loading: usersLoading,
  } = useFetch(`/api/users`);

  useEffect(() => {
    fetchTickets({ method: 'GET' });
    fetchUsers({ method: 'GET' });
  }, []);

  useEffect(() => {
    if (ticketsResponse) {
      setTickets(ticketsResponse);
    }
  }, [ticketsResponse]);

  useEffect(() => {
    if (usersResponse) {
      setUsers(usersResponse);
    }
  }, [usersResponse]);

  if (ticketsLoading || usersLoading) {
    return <CircularProgress />;
  }

  return (
    <Box className={classes.cardListBox}>
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={visibleStatuses.includes('open')}
              onChange={(e) => {
                if (e.target.checked) {
                  setVisibleStatuses([...visibleStatuses, 'open']);
                } else {
                  setVisibleStatuses(
                    visibleStatuses.filter((s) => s !== 'open')
                  );
                }
              }}
            />
          }
          label="Open"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={visibleStatuses.includes('closed')}
              onChange={(e) => {
                if (e.target.checked) {
                  setVisibleStatuses([...visibleStatuses, 'closed']);
                } else {
                  setVisibleStatuses(
                    visibleStatuses.filter((s) => s !== 'closed')
                  );
                }
              }}
            />
          }
          label="Closed"
        />
      </Box>

      {tickets && tickets.length > 0 && users.length > 0 ? (
        <List>
          {tickets
            .filter((t) => {
              return (
                (t.completed && visibleStatuses.includes('closed')) ||
                (!t.completed && visibleStatuses.includes('open'))
              );
            })
            .map((t) => (
              <TicketCard key={t.id} ticket={t} users={users} />
            ))}
        </List>
      ) : (
        <span>...</span>
      )}

      <CreateTicketModal
        open={createTicketModalOpen}
        handleClose={(createdTicket) => {
          setCreateTicketModalOpen(false);
          if (createdTicket && createdTicket.id) {
            setTickets([...tickets, createdTicket]);
          }
        }}
        users={users}
      />
      <Button
        startIcon={<AddIcon />}
        className={classes.addCardButton}
        variant="text"
        onClick={() => setCreateTicketModalOpen(true)}
      >
        Add a Card
      </Button>
    </Box>
  );
}

export default Tickets;
