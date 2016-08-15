import React from 'react'
import { connect } from 'react-redux'
import { CreateBeer } from '../data/FirebaseRef.jsx'
import MapComponent from '../components/MapComponent.jsx'
import FilterLocationsComponent from '../components/FilterLocationsComponent.jsx'

class CreateBeerContainerView extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            formFillCount: 0
        };

        // binding this to createBeer() function
        this.createBeerObject = this.createBeerObject.bind(this);
    }

    // when the beers finally are loaded from firebase, we use this to set the state
    componentWillReceiveProps (props) {

        this.setState({
            beers: props.beers,
            createBeers: props.createBeers,
            user: props.user
        });
    }

    // checks the section to see whether it has been filled out correctly
    checkFormSection (sectionNumber) {

        $('.form-row.' + sectionNumber + ' input').each(function (i) {
            console.log($(this).val(), i);
        });

        // now need to do some checking on whether each one has a value. If each one has a value then I push it


        // $('.form-row.' + sectionNumber )
        // for(var i = 0; $('.form-row.' + sectionNumber + ' input').length;)
        // console.log(valueOne, valueTwo);
        // if(valueOne !== '' && valueTwo !== '') {
        //     this.setState({
        //         formFillCount: ifSuccessful
        //     });
        // }
    }

    // creating the object to pass to firebase to add the beer to the list
    createBeerObject (event) {

        event.preventDefault();

        let error = false,
            matched = false,
            name = document.getElementById('name').value,
            friendlyUrl = name.replace(/\s+/g, '-').toLowerCase(),
            country = $('#country').val(),
            type = $('#type').val(),
            style = $('#style').val();

        // do a quick check of the select fields and if these pass we can check the name of the beer
        // if there is an error with any of them, then we will not proceed
        if(country === 'Country') {
            alert('Beer country is required');
            error = true;
        }

        if(type === 'Type') {
            alert('Beer type is required');
            error = true;
        }

        if(style === 'Style') {
            alert('Beer style is required');
            error = true;
        }

        // if there are no errors with the input fields then we can cross reference the beer name
        if(error === false) {
            // now checking to see if the beer already exists
            for(var beer in this.state.beers) {
                matched = this.state.beers[beer].url === friendlyUrl ? true : false;
            }

            if(matched === false) {

                let beerObject = {
                    name: name,
                    alcoholContent: document.getElementById('alcoholContent').value,
                    description: document.getElementById('description').value,
                    city: document.getElementById('city').value,
                    country: country,
                    manufacturer: document.getElementById('brewer').value,
                    type: type,
                    style: style,
                    locations: this.state.createBeers.locations,
                    url: friendlyUrl,
                    lastEditedBy: this.state.user.uid
                }

                // add to beers list
                CreateBeer(beerObject);
            } else {
                alert('Beer already exists');
            }
        }
    }

    render () {

        var types = this.props.types,
            styles = this.props.styles,
            locations = this.props.locations,
            countries = this.props.countries,
            beers = this.state.beers || {},
            formFillCount = this.state.formFillCount;

        var typeSelectOptions = types.map((type, i) => {
            return <option key={i} value={type}>{type}</option>
        });

        var styleSelectOptions = styles.map((style, i) => {
            return <option key={i} value={style}>{style}</option>
        });

        var countrySelectOptions = countries.map((country, i) => {
            return <option key={i} value={country}>{country}</option>
        });

        return (
            <div>
                <section className="area buffer page-title">
                    <h1>Add a beer</h1>
                </section>
                <form className="add-item-form" onSubmit={this.createBeerObject}>
                    <section className="area buffer">
                        <h2>About the beer</h2>

                        {formFillCount === 0
                        ?
                        <div className="form-row one">
                            <input id="name" className="input" placeholder="Name of beer" type="text" required />
                            <input id="alcoholContent" className="input" placeholder="Alcohol content" type="number" step="any" min="0" required/>
                            <button type="button" onClick={() => this.checkFormSection('one')}>
                                Next
                            </button>
                        </div>
                        :
                        null}

                        {formFillCount === 1
                        ?
                        <div className="form-row">
                            <textarea id="description" className="input" placeholder="Tell us about the beer" type="text" required />
                        </div>
                        :
                        null}

                        {formFillCount === 2
                        ?
                        <div className="form-row">
                            <input id="brewer" className="input" placeholder="Brewer" type="text" required />
                            <input id="city" className="input" placeholder="City of origin" type="text" required />
                            <select id="country" className="select">
                                <option>Country</option>
                                {countrySelectOptions}
                            </select>
                        </div>
                        :
                        null}

                        {formFillCount === 3
                        ?
                        <div className="form-row">
                            <input id="photo" className="input" placeholder="image url" type="file" required />
                        </div>
                        :
                        null}

                        {formFillCount === 4
                        ?
                        <div className="form-row">
                            <select id="type" className="select">
                                <option>Type</option>
                                {typeSelectOptions}
                            </select>
                            <select id="style" className="select">
                                <option>Style</option>
                                {styleSelectOptions}
                            </select>
                        </div>
                        :
                        null}

                    </section>
                    <section className="area buffer">
                        <h2>Who sells this beer?</h2>
                        {/* passing a prop flag so certain click events are displayed on the FilterLocationsComponent page */}
                        <FilterLocationsComponent creationPage={true} />
                        { Object.keys(beers).length > 0 ?
                            <button type="submit" className="button">Add!</button>
                            : null
                        }
                    </section>
                </form>
            </div>
        )
    }
}

const MapStateToProps = (state) => {

    return {
        beers: state.beers,
        types: state.beerTypes,
        styles: state.beerStyles,
        locations: state.locations,
        countries: state.countries,
        createBeers: state.createBeers,
        user: state.user
    }
}

const CreateBeerContainer = connect(MapStateToProps)(CreateBeerContainerView);

export default CreateBeerContainer
