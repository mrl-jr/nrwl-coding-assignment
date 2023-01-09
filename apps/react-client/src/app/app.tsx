import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';
import {
  Box,
  Container,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Tickets from './components/tickets/tickets';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import TicketDetails from './components/ticket-details/ticket-details';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {},
  notFoundMessage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  appTitleText: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection={'column'}
            height="100%"
          >
            <Typography
              className={classes.appTitleText}
              variant="h3"
              gutterBottom
              component={RouterLink}
              to={`/`}
            >
              Tickets App
            </Typography>
            <Routes>
              <Route path="/" element={<Tickets />} />
              <Route path="/:id" element={<TicketDetails />} />
            </Routes>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
