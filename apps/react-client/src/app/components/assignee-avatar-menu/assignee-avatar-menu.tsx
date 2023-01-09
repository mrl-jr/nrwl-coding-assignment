import { User, Ticket } from '@acme/shared-models';
import { Tooltip, Avatar, Menu, MenuItem } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import useFetch from '../../hooks/useFetch';

interface AssigneeAvatarMenuProps {
  users: User[];
  ticket: Ticket;
}

const AssigneeAvatarMenu = ({ users, ticket }: AssigneeAvatarMenuProps) => {
  const skipInitial = useRef(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [assignee, setAssignee] = useState<User>(
    ticket.assigneeId
      ? (users.find((u) => u.id === ticket.assigneeId) as User)
      : ({} as User)
  );

  const { fetchData: updateUser } = useFetch(
    `/api/tickets/${ticket.id}/assign/${
      assignee && assignee.id ? assignee.id : ''
    }`
  );

  const handleSetAssigneeMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSetAssignee = (userId: number) => {
    ticket.assigneeId = userId;
    setAssignee(users.find((u) => u.id === userId) as User);
  };

  useEffect(() => {
    if (skipInitial.current) {
      // dont want to call update on the initial render
      skipInitial.current = false;
      return;
    }
    if (assignee.id) {
      updateUser({ method: 'PUT' });
    }
  }, [assignee]);

  return (
    <>
      {assignee && assignee.name && (
        <Tooltip title={assignee.name}>
          <Avatar
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
            style={{
              cursor: 'pointer',
            }}
          >
            {assignee.name.charAt(0)}
          </Avatar>
        </Tooltip>
      )}
      {(!assignee || !assignee.name) && (
        <Tooltip title="Unassigned">
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            style={{
              cursor: 'pointer',
            }}
          >
            ?
          </Avatar>
        </Tooltip>
      )}
      <Menu
        id="set-assignee-menu"
        anchorEl={anchorEl}
        open={!ticket.completed && Boolean(anchorEl)}
        onClose={handleSetAssigneeMenuClose}
      >
        {users.map((user) => (
          <MenuItem
            key={user.id}
            onClick={() => {
              handleSetAssignee(user.id);
              handleSetAssigneeMenuClose();
            }}
          >
            {user.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AssigneeAvatarMenu;
