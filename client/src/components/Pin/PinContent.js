import React, {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import FaceIcon from "@material-ui/icons/Face";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckinIcon from "@material-ui/icons/GpsFixed";
import format from 'date-fns/format'
import Button from "@material-ui/core/Button";
import Context from '../../context';
import CreateComment from '../Comment/CreateComment';
import Comments from '../Comment/Comments';
import {useClient} from '../../client';
import {DELETE_PIN_MUTATION} from '../../graphql/mutations';

const PinContent = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { weather , feeling, note, author, createdAt, comments} = state.currentPin;
  const showEdit = state.currentUser._id === state.currentPin.author._id;
  
  const handleEdit = async () => {
    dispatch({type: "EDIT_PIN", payload: state.currentPin });
  }

  const handleCheckin = async () => {
    dispatch({type: "CREATE_DRAFT"})
  }
  
  const handleDelete = async () => {
    const variables = {pinId: state.currentPin._id};
    await client.request(DELETE_PIN_MUTATION, variables);
  }

  return (
    <div className={classes.root}>

      {!state.checkedin && (
        <Button 
        className={classes.button} 
          variant="contained" 
          color="primary" 
          onClick={handleCheckin}
        >
          <CheckinIcon className={classes.buttonIcon} />
          Check-in Now !
        </Button>
      )}

      <Typography component="h2" variant="h4" color="primary" gutterBottom>

      </Typography>
      <Typography className={classes.text} component="h3" variant="h6" color="inherit" gutterBottom>
        <FaceIcon className={classes.icon} /> {author.name}
      </Typography>
      <Typography className={classes.text} variant="subtitle2" color="inherit" gutterBottom>
        <AccessTimeIcon className={classes.icon} /> {format(Number(createdAt), "h:mm A")}
      </Typography>
      <Typography variant="subtitle2">
        Weather is <b>{weather}</b> and it feels <b>{feeling}</b> with a note of <i>{note}</i>
      </Typography>
      
      {showEdit && (
        <>
        <Button 
          className={classes.button} 
          variant="contained" 
          color="secondary" 
          onClick={handleEdit}
        >
          <EditIcon className={classes.rightIcon} />
          Edit
        </Button> 

        <Button 
          className={classes.button} 
          variant="contained" 
          color="primary" 
          onClick={handleDelete}
        >
          <DeleteIcon className={classes.leftIcon} />
          Delete
        </Button>
        </>
      )}

      <CreateComment />
      <Comments comments={comments} />
    </div>
  )
};

const styles = theme => ({
  root: {
    padding: "1em 0.5em",
    textAlign: "center",
    width: "100%"
  },
  icon: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withStyles(styles)(PinContent);
