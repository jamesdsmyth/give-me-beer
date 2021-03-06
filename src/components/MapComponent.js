import React, { PropTypes } from 'react';
import leaflet from 'leaflet';

// just to beat this no-unused-vars rule for the leaflet issue.
console.log(leaflet);

class MapComponent extends React.Component {

    componentDidMount() {
        this.createMap();
        this.setLocationMarkers();
    }

    componentWillReceiveProps() {
        this.clearMap();
        this.setLocationMarkers();
    }

    setTileLayer() {
        return L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFtZXNkc215dGgiLCJhIjoiY2lvaXFlejRoMDA2eHV1a3gwMWJyOThiYSJ9.ZHj4u050E2Ta_YiWyRnOxA', {
            maxZoom: 18
        }).addTo(this.mymap);
    }

    setLocationMarkers() {
        const locations = this.props.locations;

        const LeafIcon = L.Icon.extend({
            options: {
                iconSize: [41, 60], // size of the icon
                iconAnchor: [21, 60],
                popupAnchor: [-1, -40]
            }
        });

        const markerIcon = new LeafIcon({ iconUrl: '../src/images/pin.png' });

        L.icon = options => new L.Icon(options);

        if (locations.longitude != null) {
            L.marker([locations.longitude, locations.latitude],
                {
                    icon: markerIcon
                }
            ).addTo(this.mymap);

            this.mymap.setView([locations.longitude, locations.latitude], 15);
        } else {
            for (const location in locations) {
                L.marker([locations[location].coords.longitude, locations[location].coords.latitude],
                    {
                        icon: markerIcon
                    }
                ).addTo(this.mymap).bindPopup(`<a href="/locations/${locations[location].url}">${locations[location].name}</a>`);
            }

            this.mymap.setView([51.505, -0.09], 12);
        }
    }

    clearMap() {
        if (this.mymap != null) {
            this.mymap.eachLayer((layer) => {
                this.mymap.removeLayer(layer);
            });

            this.setTileLayer();
        }
    }

    createMap() {
        this.mymap = L.map('mapid');
        this.setTileLayer();
    }

    render() {
        return (
            <div id="mapid" />
        );
    }
}

MapComponent.propTypes = {
    locations: PropTypes.arrayOf.isRequired
};

export default MapComponent;
