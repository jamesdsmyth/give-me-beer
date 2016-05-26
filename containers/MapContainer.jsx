import React, { PropTypes } from 'react'
import leaflet from 'leaflet'
import { Link } from 'react-router'

class MapContainer extends React.Component {

    constructor (props) {
        super (props);
        this.state = {
            locations: null
        }
    }

    componentDidMount () {
        this.setLocationMarkers();
    }

    setLocationMarkers () {

        this.setState({ locations: this.props.locations });

        // var b = this.props.locations;
        // console.log(b)
        // this.setState({ locations: this.props.locations });
        var locations = this.props.locations;






        console.log(this.props.locations)
        console.log(this.state);

        // struggling with adding the state here so it changes.

        var mymap = L.map('mapid');
        L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiamFtZXNkc215dGgiLCJhIjoiY2lvaXFlejRoMDA2eHV1a3gwMWJyOThiYSJ9.ZHj4u050E2Ta_YiWyRnOxA', {
            maxZoom: 18
        }).addTo(mymap);

        var LeafIcon = L.Icon.extend({
            options: {
                iconUrl: '../node_modules/leaflet/dist/images/marker-icon.png',
                iconSize:     [38, 95], // size of the icon
                iconAnchor:   [22, 94],
                popupAnchor:  [-15, -46]
            }
        });

        var markerIcon = new LeafIcon({iconUrl: '../node_modules/leaflet/dist/images/marker-icon.png'})

        L.icon = function (options) {
            return new L.Icon(options);
        };

        if(locations.longitude != null) {
            L.marker([locations.longitude, locations.latitude],
                {
                    icon: markerIcon
                }
            ).addTo(mymap)

            mymap.setView([locations.longitude, locations.latitude], 13);

        } else {
            for(var key in locations) {
                console.log(locations[key])
                console.log(locations[key].coords.longitude);

                // var popupHTML = "<a href={'/locations/' + key}>{key}</a>"
                L.marker([locations[key].coords.longitude, locations[key].coords.latitude],
                    {
                        icon: markerIcon
                    }
                ).addTo(mymap).bindPopup('<a href="/locations/' + key + '">' + key +'</a>');
            }

            mymap.setView([51.505, -0.09], 8);
        }
    }

    render () {
        return (
            <div id="mapid"></div>
        )
    }
}

export default MapContainer
