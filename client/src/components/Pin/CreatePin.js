import React, {useState, useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from '../../context';
import axios from 'axios';
import {CREATE_PIN_MUTATION, EDIT_PIN_MUTATION} from '../../graphql/mutations';
import {useClient} from '../../client';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const CreatePin = ({ classes }) => {
  const mobileSize = useMediaQuery('(max-width:650px)');
  const client = useClient();
  const {state, dispatch} = useContext(Context);
  const {draft, checkedin, currentLocation} = state;

  const [mood, setMood] = useState(3);
  const [image, setImage] = useState('');
  const [note, setNote] = useState('');
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

      const latitude = currentLocation.latitude;
      const longitude = currentLocation.longitude;
      const variables = {mood, image:url,  note};

      if (checkedin) {
        await client.request(EDIT_PIN_MUTATION, { pinId: state.currentPin._id, ...variables} );
      }
      else {
        console.log("creating new pin now", variables);
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
      {!mobileSize && (
        <Typography 
          className={classes.alignCenter} 
          component="h2"
          variant="h4"
          color="secondary"
        >
          <LandscapeIcon className={classes.iconLarge} /> 
          Check-in Today!
        </Typography>
      )}
      
      <div>
        {displayMoodSlider(classes, mood, setMood)}

        {displayNoteSection(mobileSize, classes, note, setNote)}

        {displayImageSection(mobileSize, classes, checkedin, draft, image, setImage)}

        {displayButtonsSection({ 
          mobileSize,
          classes, 
          checkedin, 
          handleDeleteDraft, 
          mood, 
          submitting, 
          handleSubmit
      })}

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
  },
  customLabel: {
    fontSize: 20
  },
  sliderStyles: {
    width: '90%',
    margin: '0 auto'
  }
});

export default withStyles(styles)(CreatePin);

const moodMarks = [
  {
    value: 1,
    label: '😭',
  },
  {
    value: 2,
    label: '😟',
  },
  {
    value: 3,
    label: '😐',
  },
  {
    value: 4,
    label: '😊',
  },
  {
    value: 5,
    label: '😁'
  }
];

const displayImageSection = (mobileSize, classes, checkedin, draft, image, setImage) => {
  return (
    <div className={classes.contentField}>
    {/* {(checkedin && draft.image) && (
      <img 
        className={classes.popupImage}
        src={draft.image} 
        alt={draft.note}
      />
    )} */}

    <Typography>
      {!mobileSize && (
      <span>
         Add an image if you'd like
      </span>
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
    </Typography>
  </div>
  )
}

const displayMoodSlider = (classes, mood, setMood) => {
  return (
    <div className={classes.contentField}>
      <Typography id="discrete-slider-restrict" gutterBottom>
        Tell us how you're feeling (1-5)*
      </Typography>

      <div className={classes.sliderStyles}>
        <Slider
          defaultValue={mood}
          // getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-custom"
          step={0.5}
          label="How are you feeling?"
          min={1}
          max={5}
        
          valueLabelDisplay="auto"
          marks={moodMarks}
          classes={{markLabel: classes.customLabel}}
          onChangeCommitted={(event, value) => setMood(value)}
        />
      </div>
    </div>
  );
}

function displayNoteSection(mobileSize, classes, note, setNote) {
  return (
    <div className={classes.contentField}>
    <TextField
      name="note"
      label="Tell us why"
      multiline
      rows={mobileSize ? "1" : "3"}
      margin='normal'
      fullWidth
      variant="outlined" 
      value={note}
      onChange={e => setNote(e.target.value)}
    />
  </div>
  )
}

function displayButtonsSection(displayButtonSectionProps) {
  const { 
    mobileSize,
    classes, 
    checkedin, 
    handleDeleteDraft, 
    mood, 
    submitting, 
    handleSubmit
   } = displayButtonSectionProps;
  
  return (
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
      disabled={!mood || submitting}
      onClick={handleSubmit}
    >
      <SaveIcon className={classes.rightIcon}  />
        {submitting ? 'Submitting...' : 'Submit'}
    </Button>
    
    {!mobileSize && (
      <div>
      * = required
      </div>
    )}
    
  </div>
  )
}