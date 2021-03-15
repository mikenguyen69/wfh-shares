import React, {useContext, useState} from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Context from '../../context';
import CreateComment from '../Comment/CreateComment';
import Comments from '../Comment/Comments';
import {useClient} from '../../client';
import {DELETE_PIN_MUTATION} from '../../graphql/mutations';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from "@material-ui/icons/Delete"; 

const PinContent = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const { mood, note, author, createdAt, comments} = state.currentPin;
  const showEdit = state.currentUser._id === state.currentPin.author._id;
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async event => {
    event.preventDefault();
    setDeleting(true);
    console.log("Delete the pin", state.currentPin);
    const variables = {pinId: state.currentPin._id};
    await client.request(DELETE_PIN_MUTATION, variables);
  }

  return (
    <div className={classes.root}>

      <Typography paragraph color="textPrimary">
        { showEdit ? `You're` : `They're`} feeling <b>{mood}</b> out of 5 today
      </Typography>
      {
        !note 
          ? null
          : <Typography paragraph color="textSecondary">
              <q><i>{note}</i></q>
            </Typography>
      }
      {showEdit && (
        <Typography paragraph>
          <IconButton 
            disabled={deleting}
            onClick={handleDelete}
          >
            <DeleteIcon  />
          </IconButton>
        </Typography>
      )}
      
      <CreateComment />
      <Comments comments={comments} />
    </div>
  )
};

const styles = theme => ({
  
});

export default withStyles(styles)(PinContent);
