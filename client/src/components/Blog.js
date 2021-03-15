import React, {useContext, useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExploreIcon from '@material-ui/icons/Explore';
import format from 'date-fns/format'

import Context from '../context';
import PinContent from './Pin/PinContent';
import NoContent from './Pin/NoContent';

const Blog = ({ classes }) => {
  const {state, dispatch} = useContext(Context)
  const [expanded, setExpanded] = useState(false);
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    setReminder(!state.checkedin); 
  }, [state.checkedin]);

  let author = null;
  let createdAt = null;

  if (state.currentPin) {
    // if there is any currentPin being clicked
    author = state.currentPin.author;
    createdAt = state.currentPin.createdAt;
  } 
  else {
    // if no current pin, means user just login. 
    author = state.currentUser;
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCloseCheckinView = () => {
    setReminder(false);
  }

  const handleCloseView = () => {
    dispatch({type: "CLOSE_CURRENT_PIN"})
  }
  
  let BlogContent = PinContent;

  return (
    <div className={classes.root}>
      {reminder && (
        <Card>
          <CardHeader
              avatar = {
                <ExploreIcon className={classes.avatar}/>
              }
              action={
                <>
                  <IconButton 
                    onClick={handleCloseCheckinView}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
                
              }
              title={"Wecome " + state.currentUser.name}
              subheader="Pls checkin by clicking on the map"
          />
      </Card>
      )} 

      {state.currentPin && (
        <Card className={classes.viewCard}>
          <CardHeader
              avatar = {
                  <Avatar aria-label="avatar" 
                      src={author.picture} alt={author.name}  />
              }
              action={
                <>
                  <IconButton 
                    onClick={handleCloseView}
                  >
                    <CloseIcon />
                  </IconButton>

                  <IconButton
                    className={clsx(classes.expand, {
                        [classes.expandOpen]: expanded,
                    })}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </>
                
              }
              title={author.name}
              subheader={"Checked in at " + format(Number(createdAt), "h:mm A")}
          />
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent className={classes.viewContent}>
                <BlogContent />
              </CardContent>
          </Collapse>
        </Card>
      )}
      
    </div>
    
  );
};

const styles = theme => ({
  root: {
      minWidth: 300,
      maxWidth: 350,
  },
  viewCard: {
    marginTop: '0.5em'
  },
  viewContent: {
    maxHeight: "300px",
    overflowY: "scroll"
  },
  media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
  },
  expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
      }),
  },
  expandOpen: {
      transform: 'rotate(180deg)',
  },
  avatar: {
      fontSize: 40
  },
})
export default withStyles(styles)(Blog);
