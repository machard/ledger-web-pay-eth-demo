import React, { useEffect, useState } from 'react';
import {
  createMuiTheme,
  createStyles,
  ThemeProvider,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';
import client from './client';
import Web3 from 'web3';
import provider from './LedgerProvider';

const web3 = new Web3(provider);

let theme = createMuiTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3',
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  overrides: {
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

const styles = createStyles({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: "hidden"
  },
});

export interface PaperbaseProps extends WithStyles<typeof styles> {}

function Paperbase(props: PaperbaseProps) {
  const { classes } = props;
  const [sending, setSending] = useState(false);
  const [data, setData] = useState<{ amount: number, dest: string } | undefined>();

  const Providers = [
    {
      Provider: ThemeProvider,
      args: { theme, key: "theme" }
    },
  ].reduce((Provider, provider) => ({ children }) => (
    Provider({
      children: [
        // @ts-ignore
        provider.Provider({ ...provider.args,  children})
      ],
      key: "base"
    })
  ), ({ children }: any) => children);

  const pay = async() => {
    setSending(true);

    try {
      const accounts = await web3.eth.getAccounts();
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: data?.dest,
        value: web3.utils.toWei(data?.amount.toString() || ""),
      });
      await client.request("pay", "success", []);
    } catch(e) {
      console.log(e);
      await client.request("pay", "cancel", [e.message || "device sleepy ?"]);
    }
  }

  const load = async () => {
    const data = await client.request("pay", "data", []);
    setData(data);
  }
  useEffect(() => {
    load()
  }, []);

  return (
    <Providers>
      <div className={classes.root}>
        Amount: {data?.amount} ETH<br />
        Dest: {data?.dest}
        <Box m={2} />
        <Button
          variant="contained"
          color="primary"
          disabled={!data || sending}
          onClick={pay}
        >
          Pay
        </Button>
      </div>
    </Providers>
  );
}

export default withStyles(styles)(Paperbase);
