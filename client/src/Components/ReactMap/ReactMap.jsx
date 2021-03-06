import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { listLogEntries } from "./api";
import MapPin from "../../assets/icons/map-pin1.svg";
import MapPinRed from "../../assets/icons/map-pin-red1.svg";
import LogEntryForm from "../LogEntryForm/logEntryForm";
import "./reactMap.scss";

const ReactMap = () => {
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 49.246292,
    longitude: -123.116226,
    zoom: 8,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  useEffect(() => {
    getEntries();
  }, []);

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      longitude,
      latitude,
    });
  };

  const MAP = process.env.REACT_APP_MAPBOX_TOKEN;
  const MAP_STYLE = process.env.REACT_APP_MAP_STYLE;
  return (
    <div className="map">
      <ReactMapGL
        className="map__react-gl"
        {...viewport}
        // Setting map theme from mapbox
        mapStyle={MAP_STYLE}
        // mapbox Api Access Token
        mapboxApiAccessToken={MAP}
        onViewportChange={setViewport}
        onDblClick={showAddMarkerPopup}
      >
        {logEntries.map((entry) => (
          <div key={entry._id}>
            <Marker latitude={entry.latitude} longitude={entry.longitude}>
              <div
                onClick={() =>
                  setShowPopup({
                    [entry._id]: true,
                  })
                }
              >
                <img
                  className="map__pin"
                  style={{
                    width: `${4 * viewport.zoom}px`,
                    height: `${4 * viewport.zoom}px`,
                  }}
                  src={MapPin}
                  alt="Map Pin"
                />
              </div>
            </Marker>
            {showPopup[entry._id] ? (
              <Popup
                className="map__popup"
                latitude={entry.latitude}
                longitude={entry.longitude}
                dynamicPosition={true}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup({})}
                anchor="top"
              >
                <div className="map__info-container">
                  <h3 className="map__info-heading">{entry.title}</h3>
                  <hr className="map__hr" />
                  <p className="map__info-description">{entry.description}</p>
                  <hr className="map__hr" />
                  <p className="map__info-comment">{entry.comments}</p>
                  <div className="map__info-image-container">
                    {entry.image && (
                      <img
                        className="map__image"
                        src={entry.image}
                        alt={entry.title}
                      />
                    )}
                  </div>
                  <small className="map__info-visited">
                    Visited on: {new Date(entry.visitDate).toLocaleDateString()}
                  </small>
                </div>
              </Popup>
            ) : null}
          </div>
        ))}
        {addEntryLocation ? (
          <div>
            <Marker
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
            >
              <div>
                <img
                  className="map__pin-red"
                  style={{
                    width: `${4 * viewport.zoom}px`,
                    height: `${4 * viewport.zoom}px`,
                  }}
                  src={MapPinRed}
                  alt="Map Pin"
                />
              </div>
            </Marker>
            <Popup
              className="map__popup"
              latitude={addEntryLocation.latitude}
              longitude={addEntryLocation.longitude}
              dynamicPosition={true}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setAddEntryLocation(null)}
              anchor="top"
            >
              <div className="map__new-info-container">
                <LogEntryForm
                  onClose={() => {
                    setAddEntryLocation(null);
                    getEntries();
                  }}
                  location={addEntryLocation}
                />
                <form action=""></form>
              </div>
            </Popup>
          </div>
        ) : null}
      </ReactMapGL>
    </div>
  );
};

export default ReactMap;
