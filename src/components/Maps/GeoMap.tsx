import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import './geomap.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';
import { fromLonLat } from 'ol/proj';
import type { FeatureLike } from 'ol/Feature';
import type { CityData } from './types';
import CityList from './CityList';
import type Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Polygon from 'ol/geom/Polygon';

interface Props {}

const VistulaCitiesMap: React.FC<Props> = () => {
  const centerCoordinate = fromLonLat([21.968889, 51.147222]);
  const [cityData, setCityData] = useState<CityData | null>(null);
  const dataUrl = './data/route_cities.geojson';
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const mapRef = useRef<Map | null>(null);
  const navElementsRef = useRef<HTMLElement | null>(null);
  const cityNameElementRef = useRef<HTMLElement | null>(null);
  const cityImageElementRef = useRef<HTMLImageElement | null>(null);
  const vistulaCitiesLayerRef = useRef<VectorLayer<Feature> | null>(null);

  const vistulaCitiesStyle = (feature: FeatureLike) => {
    const cityID = feature.get('ID').toString();
    return new Style({
      image: new CircleStyle({
        fill: new Fill({ color: [77, 219, 105, 0.6] }),
        stroke: new Stroke({ color: [6, 125, 34, 1], width: 2 }),
        radius: 12,
      }),
      text: new Text({
        text: cityID,
        scale: 1.5,
        fill: new Fill({ color: [232, 26, 26, 1] }),
        stroke: new Stroke({ color: [232, 26, 26, 1], width: 0.3 }),
      }),
    });
  };

  const styleForSelect = (feature: FeatureLike) => {
    const cityID = feature.get('ID').toString();
    return new Style({
      image: new CircleStyle({
        fill: new Fill({ color: [247, 26, 10, 0.5] }),
        stroke: new Stroke({ color: [6, 125, 34, 1], width: 2 }),
        radius: 12,
      }),
      text: new Text({
        text: cityID,
        scale: 1.5,
        fill: new Fill({ color: [87, 9, 9, 1] }),
        stroke: new Stroke({ color: [87, 9, 9, 1], width: 0.5 }),
      }),
    });
  };

  const updateMapAndUI = (feature: Feature | undefined, clickedAnchorElement: HTMLElement | null) => {
    const map = mapRef.current;
    const navElements = navElementsRef.current;
    const cityNameElement = cityNameElementRef.current;
    const cityImageElement = cityImageElementRef.current;
    const vistulaCitiesLayer = vistulaCitiesLayerRef.current;

    if (!map || !navElements || !cityNameElement || !cityImageElement || !vistulaCitiesLayer) {
      console.error('Some elements or layers are not initialized properly.');
      return;
    }

    const mapView = map.getView();
    const vistulaCitiesFeatures = vistulaCitiesLayer.getSource()?.getFeatures() || [];

    const currentActiveStyledElement = document.querySelector('.active');
    if (currentActiveStyledElement) {
      currentActiveStyledElement.classList.remove('active');
    }
    clickedAnchorElement?.classList.add('active');

    vistulaCitiesFeatures.forEach((feature) => {
      feature.setStyle(vistulaCitiesStyle);
    });

    if (!feature) {
      mapView.animate({ center: centerCoordinate }, { zoom: 10 });
      cityNameElement.innerHTML = 'Polish places Tour Map';
      cityImageElement.setAttribute('src', './data/City_images/Polish_places_tour.png');
    } else {
      feature.setStyle(styleForSelect);

      const geometry = feature.getGeometry();
      let featureCoordinates: number[] = [];
      if (geometry instanceof Point || geometry instanceof LineString || geometry instanceof Polygon) {
        featureCoordinates = geometry.getCoordinates() as number[];
      }

      mapView.animate({ center: featureCoordinates }, { zoom: 14 });
      const featureName = feature.get('Cityname');
      const featureImage = feature.get('Cityimage');
      cityNameElement.innerHTML = `Name of the city: ${featureName}`;
      cityImageElement.setAttribute('src', `./data/City_images/${featureImage}.jpg`);
      setSelectedCityId(feature.get('ID'));
    
    }
  };

  const handleCityClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const clickedAnchorElement = e.currentTarget as HTMLElement;
    const clickedAnchorElementID = clickedAnchorElement.id;

    const currentActiveStyledElement = document.querySelector('.active');
    if (currentActiveStyledElement) {
      currentActiveStyledElement.classList.remove('active');
    }
    clickedAnchorElement?.classList.add('active');

    if (clickedAnchorElementID === 'Home') {
      updateMapAndUI(undefined, clickedAnchorElement);
    } else {
      const vistulaCitiesLayer = vistulaCitiesLayerRef.current;
      if (!vistulaCitiesLayer) return;
      const feature = vistulaCitiesLayer.getSource()?.getFeatures().find(
        (f) => f.get('Cityname') === clickedAnchorElementID
      );
      updateMapAndUI(feature, clickedAnchorElement);
    }
  }, []);

  useEffect(() => {
    const map = new Map({
      view: new View({
        center: centerCoordinate,
        zoom: 10,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'openlayers-map',
    });

    mapRef.current = map;

    const vistulaCitiesLayer = new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: dataUrl,
      }),
      style: vistulaCitiesStyle,
    });

    vistulaCitiesLayerRef.current = vistulaCitiesLayer;
    map.addLayer(vistulaCitiesLayer);

    fetch(dataUrl)
      .then((response) => response.json())
      .then((data) => setCityData(data))
      .catch((error) => console.error('Error fetching city data:', error));

    navElementsRef.current = document.querySelector('.column-navigation');
    cityNameElementRef.current = document.getElementById('cityname');
    cityImageElementRef.current = document.getElementById('cityimage') as HTMLImageElement;

    map.on('singleclick', (evt) => {
      map.forEachFeatureAtPixel(evt.pixel, (feature) => {
        const featureName = feature.get('Cityname');
        const navElement = navElementsRef.current?.querySelector(`[id="${featureName}"]`) as HTMLElement;
        updateMapAndUI(feature as Feature, navElement);
      });
    });

    const popoverTextElement = document.getElementById('popover-text');

    if (popoverTextElement) {
      const popoverTextLayer = new Overlay({
        element: popoverTextElement,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      map.addOverlay(popoverTextLayer);

      map.on('pointermove', (evt) => {
        if (map.hasFeatureAtPixel(evt.pixel)) {
          const featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
          const featureName = featureAtPixel[0].get('Cityname');
          popoverTextLayer.setPosition(evt.coordinate);
          popoverTextElement.innerHTML = featureName;
          map.getViewport().style.cursor = 'pointer';
        } else {
          popoverTextLayer.setPosition(undefined);
          map.getViewport().style.cursor = '';
        }
      });
    } else {
      console.error('Popover text element not found');
    }

    return () => {
      map.dispose();
    };
  }, []);

  return (
    <div>
      <div className="home-contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="contact-title">
                <h1>Cities Tour Map</h1>
              </div>
            </div>
          </div>
          <div className="row contact-row">
            <div className="col-lg-5">
              <div className="mapouter">
                <div className="gmap_canvas">
                  <div id="openlayers-map" style={{ height: '500px', width: '100%' }}></div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="contact-right">
                <div id="popover-text"></div>
                <div id="cityname">Welcome to Polish places Tour Map</div>
                <img id="cityimage" alt="City" src="./data/City_images/Polish_places_tour.png" className="rounded-2xl shadow-xl mb-6 aspect-thumbnail object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="column-navigation">
        <button title="Home" id="Home" className="active" onClick={handleCityClick}>
          <i className="home" id="Home">
            <svg fill="#000000" width="1rem" height="1rem" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <title>house</title>
              <path d="M0 16h4l12-13.696 12 13.696h4l-13.984-16h-4zM4 32h8v-9.984q0-0.832 0.576-1.408t1.44-0.608h4q0.8 0 1.408 0.608t0.576 1.408v9.984h8v-13.408l-12-13.248-12 13.248v13.408zM26.016 6.112l4 4.576v-8.672h-4v4.096z"></path>
            </svg>
          </i>
        </button>
        <CityList cityData={cityData} selectedCityId={selectedCityId} onCityClick={handleCityClick} />
      </div>
    </div>
  );
};

export default VistulaCitiesMap;
