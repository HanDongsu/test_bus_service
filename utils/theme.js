import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    //#6fc9ef 두루타 블루 , #b5b5b6 두루타 그레이
    primary: {
      // main: '#556cd6',
      main: '#6fc9ef',
    },
    secondary: {
      main: '#6fc9ef',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
