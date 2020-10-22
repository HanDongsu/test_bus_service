import Link from "next/link";
import Head from "next/head";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";

import Nav from "./Nav";
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0)
  },
  content: {
    padding: theme.spacing(0), // 네비 밑에 실제페이지 패딩값 
  },
  footer: {
    padding: theme.spacing(2),
    color: "#a0a0a0",
    textAlign: "center"
  }
  
}));

export default ({ children, title = "Duruta" }) => {
  const classes = useStyles();
  return (
    <div>
      
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Nav />
      <div className={classes.content}>{children}</div>
      <Divider />
      {/* <footer className={classes.footer}>
        {"ⓒ 2020 DuRuTa. All rights reserved."}
      </footer> */}
    </div>
  );
};
