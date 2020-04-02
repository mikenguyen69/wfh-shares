import React, {useState, useEffect, useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import {useClient} from '../client';
import {GET_PINS_QUERY} from '../graphql/queries';

// import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';
//import { CREATE_PIN_MUTATION } from "../graphql/mutations";
import {PIN_ADDED_SUBSCRIPTION, PIN_UPDATED_SUBSCRIPTION, COMMENT_ADDED_SUBSCRIPTION} from '../graphql/subscriptions';
import { Subscription } from "react-apollo";

const Map = ({ classes }) => {
  const client = useClient();
  const {state, dispatch} = useContext(Context);
  const {currentLocation} = state;
  const [viewport, setViewport] = useState({
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
    zoom: 11
  });

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    getPins()
  }, [])

  useEffect(() => {
    const pinExists = popup && state.pins.findIndex(pin => pin._id === popup._id) > -1
    if (!pinExists) {
      setPopup(null);
    }
  }, [state.pins.length])

  const getCurrentDate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-'+today.getDate();
    return date;
  }

  const getPins = async () => {

    const { getPins} = await client.request(GET_PINS_QUERY, 
      { today: getCurrentDate() }
    );

    dispatch({type: "GET_PINS", payload: getPins})
  }

  const handleMapClick = ({lngLat, leftButton}) => {
    
    if (!leftButton) return;
    
    // if (!state.draft) {
    //   dispatch({type: "CREATE_DRAFT"})
    // }

    // const [longitude, latitude] = lngLat;
    
    // dispatch({
    //   type: "UPDATE_DRAFT_LOCATION",
    //   payload: {longitude, latitude}
    // });    
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
  <div className={classes.root}>
    <ReactMapGL
      width="100vw"
      height="calc(100vh - 64px)" 
      mapStyle="mapbox://styles/mapbox/streets-v9" 
      mapboxApiAccessToken="pk.eyJ1IjoibWlrZW5ndXllbiIsImEiOiJjazV4OWsyb24yM29pM21vbm1iOWczcWVuIn0.-bnGQr4bUUFasXDdcRqpZw" 
      onClick={handleMapClick}
      onViewStateChange={handleViewPortChange}
      {...viewport}
      
    >
      {/* Naviation control*/}
      <div className={classes.navigationControl}>
        <NavigationControl onViewStateChange={handleViewPortChange} />
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
      {!state.checkedin && (        
          <Marker
            latitude={state.currentLocation.latitude}
            longitude={state.currentLocation.longitude}
            offsetLeft={-19}
            offsetTop={-37}
            >
            <PinIcon color="darkorange" />
          </Marker>          
      )}

      {/* Show Popups*/}
      {popup && (
        <Popup anchor="top"
          latitude={popup.latitude}
          longitude={popup.longitude}
          closeOnClick={false}
          onClose={() => setPopup(null)}
        >
          <img 
            className={classes.popupImage}
            src={popup.image} 
            alt={popup.type}
          />
          <div className={classes.popupTab}>
            <Typography>
              The weather is <b>{popup.weather}</b>
            </Typography>     
            <Typography>
              You are feeling <b>{popup.feeling}</b>
            </Typography>       
            <Typography className={classes.note}>
              <q><i>{popup.note}</i></q> - {popup.author.name}
            </Typography>
          </div>
        </Popup>
      )

      }
    </ReactMapGL>
    {/* Subscriptions for creating / updating / deleting Pins */}
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
      subscription={COMMENT_ADDED_SUBSCRIPTION}
      onSubscriptionData={({subscriptionData}) => {
        const {commentAdded} = subscriptionData.data
        console.log("Comments Added", commentAdded)
        dispatch({type: "CREATE_COMMENT", payload: commentAdded})
      }}
    />
    {/* Blog area to add Pin content */}
    <Blog />
  </div>)
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
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
    height: "30px",
    borderRadius: "90%",
  }
};

export default withStyles(styles)(Map);
