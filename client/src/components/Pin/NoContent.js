import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";

const NoContent = ({ classes }) => (
  <div className={classes.root}>
    <ExploreIcon className={classes.icon} />
    <Typography 
      noWrap
      component="h2"
      variant="h6"
      align="center"
      color="textPrimary"
      gutterBottom
    >
      Welcome to Check-in app !
    </Typography>
    <Typography 
    wrap
    align="center"
    color="textPrimary"
    gutterBottom
    >   You can either share your location or choose a location by clicking on the map
    

    </Typography>
  </div>
);

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);
