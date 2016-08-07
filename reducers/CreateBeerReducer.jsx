import Data from '../data/data.js'

const CreateBeerReducer = (state = Data.createBeer, action) => {

    let newState = null;

    switch (action.type) {

        case 'ADD_LOCATION_TO_BEER':
            newState = Object.assign({}, state, {
                locations: [
                    ...state.locations,
                        {
                            name: action.name,
                            coords: action.coords
                        }
                    ]
            });

            return newState;
            break;

        case 'REMOVE_LOCATION_FROM_BEER':

            // filtering the location we need to remove. Then below setting it
            let locationsArray = state.locations.filter((location, i) => {
                if(location.coords.longitude !== action.coords.longitude) {
                    return location;
                }
            });

            newState = Object.assign({}, state, {
                locations: locationsArray
            });

            return newState;
            break;

        default:
            return state;
    }
}

export default CreateBeerReducer