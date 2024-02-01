import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';

const MapComponent = ({ location, showDefaultMap, onSelectLocation }) => {
  const mapRef = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  useEffect(() => {
    const defaultCenter = [69.3451, 30.3753];

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(defaultCenter),
        zoom: showDefaultMap ? 5 : (location ? 15 : 2),
      }),
    });

    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    const clickHandler = (event) => {
      const clickedCoordinate = event.coordinate;
      const [longitude, latitude] = toLonLat(clickedCoordinate);

      setSelectedCoordinates({ longitude, latitude });
      onSelectLocation({ longitude, latitude });
      localStorage.setItem('longitude', longitude);
      localStorage.setItem('lattitude', latitude);
      // Add a marker at the clicked location
      const marker = new Feature({
        geometry: new Point(clickedCoordinate),
      });

      vectorSource.clear();
      vectorSource.addFeature(marker);
    };

    map.on('click', clickHandler);

    return () => {
      map.un('click', clickHandler);
      map.setTarget(undefined);
    };
  }, [location, showDefaultMap, onSelectLocation]);

  return (
    <div>
      <div ref={mapRef} style={{ height: '500px', width: '100%' }} />

      {/* {selectedCoordinates && (
        <div style={{ marginTop: '10px' }}>
          <label>Selected Coordinates:</label>
          <input
            type="text"
            value={`Latitude: ${selectedCoordinates.latitude}, Longitude: ${selectedCoordinates.longitude}`}
            readOnly
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
      )} */}
    </div>
  );
};

export default MapComponent;
