import React, {useState, useEffect, useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import {useClient} from '../client';
import {GET_PINS_QUERY} from '../graphql/queries';

import useMediaQuery from '@material-ui/core/useMediaQuery';

// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';
import CreatePin from './Pin/CreatePin';

import {PIN_ADDED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION, 
  PIN_DELETED_SUBSCRIPTION,
  COMMENT_ADDED_SUBSCRIPTION} from '../graphql/subscriptions';
import { Subscription } from "react-apollo";

const DEFAULT_VIEW_PORT = {
  latitude: -36.848754, 
  longitude: 174.765129,
  zoom: 11
}

const Map = ({ classes }) => {
  const client = useClient();
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const {state, dispatch} = useContext(Context);

  const [viewport, setViewport] = useState(DEFAULT_VIEW_PORT);

  const [popup, setPopup] = useState(null);
  const [checkinPopup, setCheckinPopup] = useState(null);

  useEffect(() => {
    console.log("reload the pins when lengths change");
    getPins();
  },[state.pins.length])

  useEffect(() => {
    const pinExists = popup && state.pins.findIndex(pin => pin._id === popup._id) > -1
    if (!pinExists) {
      setPopup(null);
    }
  }, [state.pins.length])

  useEffect(() => {
    if (!state.currentPin) {
      setPopup(null);
    }
  }, [state.currentPin])
  useEffect(() => {
    if (state.checkedin) {
      setCheckinPopup(null);
    }
  }, [state.checkedin])

  const getPins = async () => {

    const { getPins} = await client.request(GET_PINS_QUERY);
    dispatch({type: "GET_PINS", payload: getPins})
  }

  const handleMapClick = ({lngLat: [longitude, latitude], leftButton}) => {
    if (leftButton && !state.checkedin) {
      const selectedLocation = {latitude: latitude, longitude: longitude};
      setCheckinPopup(selectedLocation);
      
      // close any openning popup
      setPopup(null);
      dispatch({type: "SET_CURRENT_LOCATION", payload: selectedLocation})
    }
  }

  const handleViewPortChange = newViewport => {
    setViewport(newViewport);
  }

  const handleSelectPin = pin => {
    setPopup(pin);    
    dispatch({
      type: "SET_PIN",
      payload: pin
    })
  }

  return (
  <>
    <ReactMapGL
      width="100vw" 
      height="calc(100vh - 64px)"
      mapStyle="mapbox://styles/mapbox/streets-v9" 
      mapboxApiAccessToken="pk.eyJ1IjoibWlrZW5ndXllbiIsImEiOiJjazV4OWsyb24yM29pM21vbm1iOWczcWVuIn0.-bnGQr4bUUFasXDdcRqpZw" 
      onClick={handleMapClick}
      onViewportChange={handleViewPortChange}
      {...viewport}
      scrollZoom={!mobileSize}
    >
      {/* Naviation control*/}
      <div className={classes.navigationControl}>
        <NavigationControl onViewportChange={handleViewPortChange} />
      </div>

      {/* Created Pins*/}
      {state.pins.map(pin => (
        <Marker
          key={pin._id}
          latitude={pin.latitude}
          longitude={pin.longitude}
          offsetLeft={-19}
          offsetTop={-37}           
          >
            
          <img 
            className={classes.picture}
            src={pin.author.picture} 
            alt={pin.note}
            onClick={() => handleSelectPin(pin)} />
        </Marker>
      ))}

      
        
      {/* For current user location */}
      {checkinPopup && (        
          <>
            <Marker
              latitude={checkinPopup.latitude}
              longitude={checkinPopup.longitude}
              offsetLeft={-19}
              offsetTop={-37}
              >
              <PinIcon color="darkorange" />
            </Marker> 
            <Popup anchor="top"
              className={classes.checkinPopup}
              latitude={checkinPopup.latitude}
              longitude={checkinPopup.longitude}
              closeOnClick={false}
              onClose={() => setCheckinPopup(null)}
            >
              <CreatePin />
            </Popup>  
          </>     
      )}

      {/* Show Popups*/}
      {popup && (
        <Popup anchor="top"
          latitude={popup.latitude}
          longitude={popup.longitude}
          closeOnClick={false}
          onClose={() => setPopup(null)}
        >
          {
            !popup.image ? null
            : <div className={classes.imageContainer}>
                <img 
                  className={classes.popupImage}
                  src={popup.image} 
                  alt={popup.type}
                />
              </div> 
          }
          
          <div className={classes.popupTab}>
            <Typography className={classes.note}>
              {popup.author.name}'s mood is <b>{popup.mood}</b> out of 5 today
            </Typography>
            {
              !popup.note 
                ? null 
                : <Typography className={classes.note}>
                    <q><i>{popup.note}</i></q>
                  </Typography>
            }     
          </div>
        </Popup>
      )}
    </ReactMapGL>
    {/* Subscriptions for creating / updating / deleting Pins */}
    <>
    <Subscription
      subscription={PIN_ADDED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const {pinAdded} = subscriptionData.data
        console.log("Pin Added", pinAdded)
        dispatch({type: "CREATE_PIN", payload: pinAdded})
      }}
    />
    <Subscription
      subscription={PIN_UPDATED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const {pinUpdated} = subscriptionData.data
        console.log("Pin updated", pinUpdated)
        dispatch({type: "CREATE_PIN", payload: pinUpdated})
      }}
    />
    <Subscription
      subscription={PIN_DELETED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const {pinDeleted} = subscriptionData.data
        console.log("Pin deleted", pinDeleted)
        dispatch({type: "DELETE_PIN", payload: pinDeleted })
      }}
    />
    <Subscription
      subscription={COMMENT_ADDED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const {commentAdded} = subscriptionData.data
        console.log("Comments Added", commentAdded)
        dispatch({type: "CREATE_COMMENT", payload: commentAdded})
      }}
    />
    </>
    {/* Blog area to add Pin content only for web */}
      
    <div className={mobileSize ? classes.blogAreaMobile: classes.blogArea}>
      <Blog />
    </div>
  </>)
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  geolocateControl: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: "1em"
  },
  blogArea: {
    position: "absolute",
    top: '64px',
    right:0,
    margin: "0.5em"
  },
  blogAreaMobile: {
    position: "absolute",
    top: '56px',
    right:0,
    margin: "0.5em"
  },
  deleteIcon: {
    color: "red"
  },
  checkinPopup: {
    minWidth: 300,
    maxWidth: 350,
    minHeight: 350,
    maxHeight: 400,
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  note: {
    maxWidth: 200,
    paddingTop: "0.5em"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  picture: {
    height: 30,
    width: 30,
    borderRadius: "90%",
    objectFit: 'cover'
  },
  imageContainer: {
    textAlign: 'center'
  }
};

export default withStyles(styles)(Map);
