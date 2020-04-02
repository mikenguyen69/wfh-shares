import React, {useState, useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from '../../context';
import axios from 'axios';
import {CREATE_PIN_MUTATION, EDIT_PIN_MUTATION} from '../../graphql/mutations';
import {useClient} from '../../client';


const CreatePin = ({ classes }) => {
  const client = useClient();
  const {state, dispatch} = useContext(Context);
  const {draft, checkedin} = state;

  const [feeling, setFeeling] = useState(checkedin ? draft.feeling: '');
  const [weather, setWeather] = useState(checkedin ? draft.weather : '');
  const [image, setImage] = useState('');
  const [note, setNote] = useState(checkedin ? draft.note: '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      setSubmitting(true);

      let url;
      // handle image optional or no change
      if (image !== '') {
        url = await handleImageUpload();
      } 
      else if (checkedin) {
        url = draft.image;
      }

      const {latitude, longitude} = draft;
      const variables = {weather, feeling, image:url,  note};

      console.log('before submitting',image, variables, draft, state.currentPin)

      if (checkedin) {
        await client.request(EDIT_PIN_MUTATION, { pinId: state.currentPin._id, ...variables} );
      }
      else {
        await client.request(CREATE_PIN_MUTATION, {...variables, latitude, longitude });
      }
     
      handleDeleteDraft();
    }
    catch(err) {
      console.error("Error while submitting", err);
    }
    
  }

  const handleImageUpload = async () => {

    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "geovehicles")
    data.append("cloud_name", "mikenguyen")
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/mikenguyen/image/upload",
      data
    )

    return res.data.url;
  }

  const handleDeleteDraft = event => {
    dispatch({type: "DELETE_DRAFT"});
  }

  return (
    <form className={classes.form}>
      <Typography 
        className={classes.alignCenter} 
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> 
        Check-in Today!
      </Typography>
      <div>
      <div className={classes.contentField}>
        <TextField  
          id="select-weather-type"
          select
          name="type"
          label="What does weather like?" 
          fullWidth
          value={weather} 
          onChange={(event) => setWeather(event.target.value)}         
        >
          {weathers.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
       </div>
       <div className={classes.contentField}>
        <TextField  
          id="select-status-type"
          select
          name="feeling"
          label="How do you feel today?"
          fullWidth
          value={feeling} 
          onChange={(event) => setFeeling(event.target.value)}         
        >
          {feelings.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        </div>
        <div className={classes.contentField}>
          {checkedin && (
            <img 
              className={classes.popupImage}
              src={draft.image} 
              alt={draft.note}
            />
          )}

          <input 
            accept="image/*" 
            id="image" 
            type="file"
            className="classes.input"
            onChange={e => setImage(e.target.files[0])}
          />
          <label htmlFor="image">
            <Button style={{color: image && "green"}}
              component="span"
              size="small"
              className={classes.Button}
            >
              <AddAPhotoIcon />
            </Button>
          </label>
        </div>
        <div className={classes.contentField}>
          <TextField
            name="note"
            label="Note"
            multiline
            rows="3"
            margin='normal'
            fullWidth
            variant="outlined" 
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>
        <div className={classes.contentField}>
          { checkedin && (
            <Button 
              className={classes.button} 
              variant="contained" 
              color="primary" 
              onClick={handleDeleteDraft}
            >
              <ClearIcon className={classes.leftIcon} />
              Discard
            </Button>
          )}
          
          <Button 
            className={classes.button} 
            variant="contained" 
            color="secondary" 
            disabled={!weather.trim() || !feeling.trim() || !note.trim() || submitting}
            onClick={handleSubmit}
          >
            <SaveIcon className={classes.rightIcon}  />
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    width: "95%"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
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
  }
});

export default withStyles(styles)(CreatePin);


const weathers = [
  {
    value: 'sunny',
    label: 'Sunny',
  },
  {
    value: 'cloudy',
    label: 'Cloudy',
  },
  {
    value: 'windy',
    label: 'Windy',
  },
  {
    value: 'rainy',
    label: 'Rainy',
  }
];

const feelings = [
  {
    value: 'great',
    label: 'Great'
  },
  {
    value: 'lucky',
    label: 'Lucky'
  },
  {
    value: 'thankful',
    label: 'Thankful'
  },
  {
    value: 'peaceful',
    label: 'Peaceful'
  },
  {
    value: 'quiet',
    label: 'Quiet'
  },
]