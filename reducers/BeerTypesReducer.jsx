import Data from '../data/data.js'

var BeerTypesReducer = (state = Data.beerTypes, action) => {

    var newState = Object.assign({}, state);

    console.log(state)

    switch (action.type) {
        case 'ALL_BEER_TYPES':

            newState = action.data.beerTypes;
            console.log(newState);
            return newState;
            break;

        default:
            return state;
    }
}

export default BeerTypesReducer
