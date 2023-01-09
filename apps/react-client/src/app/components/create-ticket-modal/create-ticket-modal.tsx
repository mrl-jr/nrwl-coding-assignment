import { Ticket, User } from '@acme/shared-models';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fade,
  FormControl,
  FormGroup,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Select,
  TextareaAutosize,
  TextField,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';

interface CreateTicketModalProps {
  open: boolean;
  handleClose: (createdTicket: Ticket) => void;
  users: User[];
}
const style = {
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const useStyles = makeStyles((theme) => ({
  createTicketModalBox: {
    width: 500,
    height: 'auto',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
  },
  ticketDescriptionFormControl: {
    width: '100%',
    paddingBottom: '1em',
  },
  assigneeFormControl: {
    width: '50%',
  },
  submitButton: {
    width: '100%',
    marginTop: '1em',
  },
}));

const CreateTicketModal = ({
  open,
  handleClose,
  users,
}: CreateTicketModalProps) => {
  const [assignee, setAssignee] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const classes = useStyles();
  const {
    fetchData: createTicket,
    loading: submitting,
    data: createdTicket,
  } = useFetch('/api/tickets');

  const handleCreateTicket = (e: any) => {
    e.preventDefault();
    console.log('create ticket', assignee, e.target[0].value);
    console.log(description);
    createTicket({
      method: 'POST',
      body: {
        description: description,
      },
    });
  };

  useEffect(() => {
    if (createdTicket) {
      handleClose(createdTicket);
      console.log('success', createdTicket)
    }
  }, [createdTicket]);

  if (submitting) {
    return <CircularProgress />;
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <form onSubmit={handleCreateTicket}>
          <Box sx={style} className={classes.createTicketModalBox}>
            <h2 id="parent-modal-title">Add a Card</h2>
            <FormGroup>
              <FormControl className={classes.ticketDescriptionFormControl}>
                <TextField
                  placeholder="Enter a description for this card..."
                  multiline
                  minRows={4}
                  maxRows={4}
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  required
                />
              </FormControl>
            </FormGroup>
            {/* <FormGroup>
              <FormControl className={classes.assigneeFormControl}>
                <InputLabel id="demo-simple-select-label">Assignee</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={assignee}
                  label="Assignee"
                  onChange={(e) => {
                    setAssignee(e.target.value as string);
                  }}
                >
                  {users.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormGroup> */}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.submitButton}
            >
              Create
            </Button>
          </Box>
        </form>
      </Fade>
    </Modal>
  );
};

export default CreateTicketModal;
