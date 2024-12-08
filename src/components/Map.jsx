import React, { useRef, useState, useEffect, useContext } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Source, Layer, GeolocateControl, FullscreenControl, NavigationControl } from 'react-map-gl';
import pin from "../assets/passengericon.png"; // Ensure path is correct
import jeepPin from "../assets/jeepLogoPin.png";
import useFetchLocation from "../CustomHooks/useFetchLocation.js"; // Ensure path is correct
import { JeepSatatusContext } from "../ContextProvider/JeepStatus.jsx";
import {CurrentUserContext} from "../ContextProvider/CurrentUser.jsx";
import {Marker} from "react-map-gl";
export default function RenderMap() {
    const [showPopup, setShowPopup] = useState(true);
const {mapStyle}=useContext(CurrentUserContext)
    const {
        mapRef,
        FallowDriver,
        activeJeepId,
        JeepStatusModal,
        setJeepStatusModal,
        setActiveJeepId,
        openBottomSheet,
        setOpenBottomSheet,ShowPassenger,setShowPassenger,
        ShowDrivers,setShowDrivers
    } = useContext(JeepSatatusContext);
    const {CurrentUser} = useContext(CurrentUserContext)
    const [mapLoaded, setMapLoaded] = useState(false);
    const [userLocationData] = useFetchLocation("users");
    const [driverLocationData] = useFetchLocation("drivers");
    const FilterCurrentDriver = driverLocationData?.filter(user => user?.id !== CurrentUser?.providerData[0]?.uid);
    const FilterCurrentUser = userLocationData?.filter(user => user?.id !== CurrentUser?.providerData[0]?.uid && user?.status === "waiting");

    const PassengerLocationMarker = {
        type: 'FeatureCollection',
        features: FilterCurrentUser?.map(user => ({
            type: 'Feature',
            properties: {
                icon: 'passenger-pin',
                id: user?.id,
                name: user?.first,
                role: user?.role,
            },
            geometry: {
                type: 'Point',
                coordinates: [user?.longitude, user?.latitude],
            },
        })),
    };

    const DriverLocationMarker = {
        type: 'FeatureCollection',
        features: FilterCurrentDriver?.map(user => ({
            type: 'Feature',
            properties: {
                icon: 'driver-pin',
                id: user?.id,
                name: user?.name,
                startpoint: user?.startpoint,
                endpoint: user?.endpoint,
            },
            geometry: {
                type: 'Point',
                coordinates: [user?.longitude, user?.latitude],
            },
        })),
    };

    const loadImage = (mapInstance, imagePath, imageId) => {
        mapInstance.loadImage(imagePath, (error, image) => {
            if (error) {
                console.error(`Error loading ${imageId} pin:`, error);
                return;
            }
            if (!mapInstance.hasImage(imageId)) {
                mapInstance.addImage(imageId, image);
            }
        });
    };

    const handleMapLoad = () => {
        setMapLoaded(true);
        const mapInstance = mapRef.current;

        if (mapInstance) {
            mapInstance.on('load', () => {
                loadImage(mapInstance, pin, 'passenger-pin');
                loadImage(mapInstance, jeepPin, 'driver-pin');
            });

            // Handle missing images event
            mapInstance.on('styleimagemissing', (e) => {
                if (e.id === 'passenger-pin') {
                    console.log('Passenger pin image is missing, adding it...');
                    loadImage(mapInstance, pin, 'passenger-pin');
                }

                if (e.id === 'driver-pin') {
                    console.log('Driver pin image is missing, adding it...');
                    loadImage(mapInstance, jeepPin, 'driver-pin');
                }
            });

            // Global click handler

        }
    };

    useEffect(() => {
        if (mapLoaded && mapRef.current) {
            const mapInstance = mapRef.current.getMap();
            if (mapInstance) {
                mapInstance.on('load', () => {
                    loadImage(mapInstance, pin, 'passenger-pin');
                    loadImage(mapInstance, jeepPin, 'driver-pin');
                });
                mapRef.current.on('click','driver-points', (e) => {
                    const features = mapInstance.queryRenderedFeatures(e.point);
                    console.log(features[0].properties.id)

                        setActiveJeepId(features[0].properties.id || null)





                });
            }
        }
    }, [mapLoaded]);

    // Example route data for the line
    const routeData = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: JeepStatusModal?.distance?.routes[0]?.geometry.coordinates || [0, 0],
                },
            },
        ],
    };

    const handleLayerClick = (e) => {
        const features = e.features;
        if (features.length > 0) {
            const clickedFeature = features[0];
            console.log('Clicked feature:', clickedFeature);

        }
    };

    return (
        <Map
            ref={mapRef}
            projection={"globe"}
            maxTileCacheSize={2000}
            mapboxAccessToken="pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl5ZDZhbzcxY2s3Mm5zbG1taWZ1MDBjIn0.1nOWIuN47R6lsU1QXp40KQ"
            initialViewState={{
                longitude: 120.44675663003221,
                latitude: 16.935214106995574,
                zoom: 14,
                bearing: 12,
                pitch: 30,
            }}
            attributionControl={false}
            logoPosition={"top-right"}
            mapStyle={mapStyle}
            onLoad={handleMapLoad}
        >
            <GeolocateControl  showUserHeading={true}      onGeolocate={(e)=>{console.log(e)}}    trackUserLocation={true} style={{ background: "#3083FF", color: "pink", marginLeft: 10, marginTop: 70,borderRadius:100, padding: 6 }} position="top-left" />

            {mapLoaded && (
                <>
                    {
                        ShowPassenger &&
                        <Source id="passenger-locations" type="geojson" data={PassengerLocationMarker} cluster={true} clusterMaxZoom={20} clusterRadius={40}>
                            <Layer

                                id="passenger-clusters"
                                type="circle"
                                filter={['has', 'point_count']}
                                paint={{
                                    "circle-stroke-color": 'rgba(48,131,255,0.38)',
                                    "circle-stroke-width": 5,
                                    'circle-color': '#3083FF',
                                    "text-color": "#fff",
                                    'circle-radius': [
                                        'step',
                                        ['get', 'point_count'],
                                        20,
                                        100,
                                        30,
                                        750,
                                        40,
                                    ],
                                }}

                            />
                            <Layer

                                id="passenger-cluster-count"
                                type="symbol"
                                filter={['has', 'point_count']}
                                layout={{
                                    'text-field': '{point_count_abbreviated}',
                                    'text-size': 12,
                                    'text-allow-overlap': true,
                                }}
                                paint={{
                                    "text-color": "#fff",
                                }}
                            />
                            <Layer
                                id="passenger-points"
                                type="symbol"
                                filter={['!', ['has', 'point_count']]}
                                layout={{
                                    "icon-allow-overlap": true,
                                    'icon-image': 'passenger-pin',
                                    'icon-size': 0.3,
                                }}

                            />
                        </Source>

                    }
                    {/*{*/}
                    {/*    ShowDrivers &&*/}
                    {/*<Source id="driver-locations" type="geojson" data={DriverLocationMarker} cluster={true} clusterMaxZoom={14} clusterRadius={50}>*/}
                    {/*    <Layer*/}
                    {/*        id="driver-clusters"*/}
                    {/*        type="circle"*/}
                    {/*        filter={['has', 'point_count']}*/}
                    {/*        paint={{*/}
                    {/*            "circle-stroke-color": 'rgba(131,169,255,0.64)',*/}
                    {/*            "circle-stroke-width": 5,*/}
                    {/*            'circle-color': '#a4c3ff',*/}
                    {/*            "text-color": "#fff",*/}
                    {/*            'circle-radius': [*/}
                    {/*                'step',*/}
                    {/*                ['get', 'point_count'],*/}
                    {/*                20,*/}
                    {/*                100,*/}
                    {/*                30,*/}
                    {/*                750,*/}
                    {/*                40,*/}
                    {/*            ],*/}
                    {/*        }}*/}
                    {/*        onClick={handleLayerClick}  // Handle click events*/}
                    {/*    />*/}
                    {/*    <Layer*/}
                    {/*        id="driver-cluster-count"*/}
                    {/*        type="symbol"*/}
                    {/*        filter={['has', 'point_count']}*/}
                    {/*        layout={{*/}
                    {/*            'text-field': '{point_count_abbreviated}',*/}
                    {/*            'text-size': 12,*/}
                    {/*        }}*/}
                    {/*        paint={{*/}
                    {/*            "text-color": "#fff",*/}
                    {/*        }}*/}
                    {/*        onClick={handleLayerClick}  // Handle click events*/}
                    {/*    />*/}
                    {/*    <Layer*/}
                    {/*        id="driver-points"*/}
                    {/*        type="symbol"*/}
                    {/*        filter={['!', ['has', 'point_count']]}*/}
                    {/*        layout={{*/}
                    {/*            "icon-allow-overlap": true,*/}
                    {/*            'icon-image': 'driver-pin',*/}
                    {/*            'icon-size': 0.3,*/}
                    {/*        }}*/}
                    {/*        onClick={handleLayerClick}  // Handle click events*/}
                    {/*    />*/}
                    {/*</Source>*/}
                    {/*}*/}

                    <Source id="route" type="geojson" data={routeData}>
                        <Layer
                            id="route-line"
                            type="line"
                            paint={{
                                'line-color': '#3083FF',
                                'line-width': 10,
                            }}
                        />
                    </Source>
                </>
            )}


            {
                FilterCurrentDriver?.map((user,index)=>{

                    return (
                        <Marker
                            key={`marker-${index}`}
                            longitude={user.longitude}
                            latitude={user.latitude}
                            anchor="bottom"
element={null}

                        >
                            <img src={user?.jeepImages[0]} className= " border-4 object-cover rounded-full  border-white w-10 h-10"/>

                        </Marker>

                    )
                })
            }

        </Map>
    );
}
