import React from 'react'
import { connect } from 'react-redux'
import Store from '../reducers/CombinedReducers.jsx'
import { initialiseBeerCreation, clearLocationsFromBeer } from '../actions/actions.js'
import { CreateBeer } from '../data/FirebaseRef.jsx'
import MapComponent from '../components/MapComponent.jsx'
import FilterLocationsComponent from '../components/FilterLocationsComponent.jsx'

class CreateBeerContainerView extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            formFillCount: 0,
            showNextButton: false,
            VisibleSection: 'form',
            country: 'Country',
            type: 'Type',
            style: 'Style'
        }

        // binding this to createBeer() function
        this.createBeerObject = this.createBeerObject.bind(this);
    }

    // when the beers finally are loaded from firebase, we use this to set the state
    componentWillReceiveProps (props) {

        this.setState({
            beers: props.beers,
            createBeers: props.createBeers,
            VisibleSection: props.createBeers.VisibleSection,
            user: props.user
        });
    }

    // checks the section to see whether it has been filled out correctly
    checkFormSection (sectionNumber) {
        let completed = 0;
        let inputCount = 0;
        let section = $('.form-row.' + sectionNumber);

        section.find('.input').each(function () {
            inputCount++;
            if($(this).val() !== ('') && ($(this).val() !== 'Country') && ($(this).val() !== 'Type') && ($(this).val() !== 'Style')) {
                completed++;
            }
        });

        // if the number of completed fields === the number of inputs, then we can show the next button
        if(completed === inputCount) {
            this.setState({
                showNextButton: true
            });
        } else {
            this.setState({
                showNextButton: false
            });
        }
    }

    // we check whether the name of the beer exists here. If it does we break the loop and show a warning.
    // the user can not go forward without creating a new beer with an individual name
    checkBeerName () {
        let newBeer = $('#name').val().replace(/\s+/g, '-').toLowerCase();
        let matched = false;

        for(var beer in this.state.beers) {
            matched = this.state.beers[beer].url === newBeer ? true : false;

            if(matched === true) {
                alert('This beer already exists');
                break;
            }
        }

        matched === false ? this.nextButtonClick('zero') : null;
    }

    // clicking the next button will change the question section.
    // this is done by increasing the formFillCount which matches to the section that relates to that number
    nextButtonClick (section) {

        var setObject = {};

        switch (section) {

            case 'zero':

                setObject = {
                    name: $('#name').val(),
                    alcoholContent: $('#alcoholContent').val()
                }

                break;

            case 'one':

                setObject = {
                    description: $('#description').val()
                }

                break;

            case 'two':

                setObject = {
                    manufacturer: $('#manufacturer').val(),
                    city: $('#city').val(),
                    country: $('#country').val()
                }

                break;

            case 'three':

                setObject = {
                    photo: document.getElementById('photo').files[0]
                }

                break;


            case 'four':

                setObject = {
                    type: $('#type').val(),
                    style: $('#style').val()
                }

                break;
        }

        setObject.formFillCount = this.state.formFillCount + 1;
        setObject.showNextButton = false;

        this.setState(setObject);
        this.setFieldData();
    }

    previousButtonClick () {
        this.setState({
            formFillCount: this.state.formFillCount - 1,
            showNextButton: true
        });

        this.setFieldData();
    }

    // when we navigate through the steps, we want to populate data that the user has already filled out
    setFieldData () {

        setTimeout(() => {
            $('#name').val(this.state.name);
            $('#alcoholContent').val(this.state.alcoholContent);
            $('#description').val(this.state.description);
            $('#manufacturer').val(this.state.manufacturer);
            $('#city').val(this.state.city);
            $('#country').val(this.state.country);
            $('#photo').val(this.state.photo);
            $('#type').val(this.state.type);
            $('#style').val(this.state.style);
        }, 250);
    }

    // clears the form so no input is populated
    clearFormData () {
        this.setState({
            name: null,
            alcoholContent: null,
            description: null,
            manufacturer: null,
            country: null,
            country: null,
            photo: null,
            type: null,
            style: null,
            formFillCount: 0,
            showNextButton: false
        });
    }

    // removes all selected locations from the beer so a new beer can be created
    clearLocations () {
        Store.dispatch(clearLocationsFromBeer());
    }

    // navigates the user to the form section again ready to create a new beer
    viewForm () {
        Store.dispatch(initialiseBeerCreation());
    }

    // creating the object to pass to firebase to add the beer to the list
    createBeerObject (event) {

        event.preventDefault();

        let beerObject = {
            name: this.state.name,
            alcoholContent: this.state.alcoholContent,
            description: this.state.description,
            manufacturer: this.state.manufacturer,
            city: this.state.city,
            country: this.state.country,
            type: this.state.type,
            photo: this.state.photo,
            style: this.state.style,
            locations: this.state.createBeers.locations || [],
            url: this.state.name.replace(/\s+/g, '-').toLowerCase(),
            lastEditedBy: this.state.user.uid
        }

        // add to beers list
        CreateBeer(beerObject);
    }

    render () {

        var types = this.props.types,
            styles = this.props.styles,
            locations = this.props.locations,
            countries = this.props.countries,
            beers = this.state.beers || {},
            formFillCount = this.state.formFillCount,
            sectionToDisplay = this.state.VisibleSection,
            VisibleSection = null

        var typeSelectOptions = types.map((type, i) => {
            return <option key={i} value={type}>{type}</option>
        });

        var styleSelectOptions = styles.map((style, i) => {
            return <option key={i} value={style}>{style}</option>
        });

        var countrySelectOptions = countries.map((country, i) => {
            return <option key={i} value={country}>{country}</option>
        });

        {/* switch statement for the different panels needed in filling out, submitted and getting the success/failure from submitting a beer*/}
        switch (sectionToDisplay) {
            case 'form':
            VisibleSection =  <form className="add-item-form" onSubmit={this.createBeerObject}>

                                {/* this is section one and is shown only for the first 4 sections */}
                                {formFillCount < 5 ?
                                <section className="area buffer">
                                    <h2>About the beer</h2>
                                    <p>Here you can add a beer and tell us where it is currently being sold.</p>
                                    {formFillCount === 0 ?
                                    <div className="form-row zero">
                                        <input id="name"
                                            className="input"
                                            placeholder="The beers name"
                                            type="text" onChange={() => this.checkFormSection('zero')}
                                            required />
                                        <input id="alcoholContent"
                                            className="input"
                                            placeholder="Alcohol content in %"
                                            type="number" onChange={() => this.checkFormSection('zero')}
                                            step="any"
                                            min="0"
                                            required />
                                        <div className="buttons">
                                            {/* if everything is filled out, we will show the next button */}
                                            {this.state.showNextButton === true ?
                                                <button type="button"
                                                    className="button secondary"
                                                    onClick={() => this.checkBeerName()}>
                                                    Next
                                                </button>
                                            :
                                            null}
                                        </div>
                                    </div>
                                    :
                                    null}

                                    {formFillCount === 1
                                    ?
                                    <div className="form-row one">
                                        <textarea id="description"
                                            className="input textarea"
                                            placeholder="Tell us about the beer"
                                            type="text"
                                            onChange={() => this.checkFormSection('one')}
                                            required />
                                        <div className="buttons">
                                            <button type="button"
                                                className="button secondary"
                                                onClick={() => this.previousButtonClick()}>
                                                Previous
                                            </button>
                                            {this.state.showNextButton === true ?
                                                <button type="button"
                                                    className="button secondary"
                                                    onClick={() => this.nextButtonClick('one')}>
                                                    Next
                                                </button>
                                            :
                                            null}
                                        </div>
                                    </div>
                                    :
                                    null}

                                    {formFillCount === 2
                                    ?
                                    <div className="form-row two">
                                        <input id="manufacturer"
                                            className="input"
                                            placeholder="Brewer"
                                            type="text"
                                            onChange={() => this.checkFormSection('two')}
                                            required />
                                        <input id="city"
                                            className="input"
                                            placeholder="City of origin"
                                            type="text"
                                            onChange={() => this.checkFormSection('two')}
                                            required />
                                        <select id="country"
                                            className="select input"
                                            onChange={() => this.checkFormSection('two')}>
                                            <option value="Country">Country</option>
                                            {countrySelectOptions}
                                        </select>
                                        <div className="buttons">
                                            <button type="button"
                                                className="button secondary"
                                                onClick={() => this.previousButtonClick()}>
                                                Previous
                                            </button>
                                            {this.state.showNextButton === true ?
                                                <button type="button"
                                                    className="button secondary"
                                                    onClick={() => this.nextButtonClick('two')}>
                                                    Next
                                                </button>
                                            :
                                            null}
                                        </div>
                                    </div>
                                    :
                                    null}

                                    {formFillCount === 3
                                    ?
                                    <div className="form-row three">
                                        <input id="photo"
                                            className="input"
                                            placeholder="image url"
                                            type="file"
                                            onChange={() => this.checkFormSection('three')}
                                            required />
                                        <div className="buttons">
                                            <button type="button"
                                                className="button secondary"
                                                onClick={() => this.previousButtonClick()}>
                                                Previous
                                            </button>
                                            {this.state.showNextButton === true ?
                                                <button type="button"
                                                    className="button secondary"
                                                    onClick={() => this.nextButtonClick('three')}>
                                                    Next
                                                </button>
                                            :
                                            null}
                                        </div>
                                    </div>
                                    :
                                    null}

                                    {formFillCount === 4
                                    ?
                                    <div className="form-row four">
                                        <select id="type"
                                            className="select input"
                                            onChange={() => this.checkFormSection('four')}>
                                            <option value="Type">Type</option>
                                            {typeSelectOptions}
                                        </select>
                                        <select id="style"
                                            className="select input"
                                            onChange={() => this.checkFormSection('four')}>
                                            <option value="Style">Style</option>
                                            {styleSelectOptions}
                                        </select>
                                        <div className="buttons">
                                            <button type="button"
                                                className="button secondary"
                                                onClick={() => this.previousButtonClick()}>
                                                Previous
                                            </button>
                                            {this.state.showNextButton === true ?
                                                <button type="button"
                                                    className="button secondary"
                                                    onClick={() => this.nextButtonClick('four')}>
                                                    Next
                                                </button>
                                            :
                                            null}
                                        </div>
                                    </div>
                                    :
                                    null}

                                </section>
                                :
                                null
                                }

                                {/* this is section 5 and is shown only for the last section */}
                                {formFillCount === 5
                                ?
                                <section className="area buffer">
                                    <h2>Who sells this beer?</h2>
                                    {/* passing a prop flag so certain click events are displayed on the FilterLocationsComponent page */}
                                    <FilterLocationsComponent creationPage={true} />
                                    <div className="buttons">
                                        <button type="button"
                                            className="button secondary"
                                            onClick={() => this.previousButtonClick()}>
                                            Previous
                                        </button>
                                        <button type="submit"
                                            className="button primary">
                                            Create beer!
                                        </button>
                                    </div>
                                </section>
                                :
                                null}
                            </form>

                break;

            case 'submitted':
                VisibleSection =  <section className="area buffer">
                                    <p>Your beer is being created...</p>
                                </section>
                break;

            case 'success':
                VisibleSection =  <section className="area buffer">
                                    <p>You have just added a beer!</p>
                                    <div className="buttons">
                                        <button type="button"
                                                className="button secondary"
                                                onClick={() => this.clearFormData(),
                                                         () => this.clearLocations()}>
                                            Create another beer
                                        </button>
                                    </div>
                                </section>
                break;

            case 'failure':
                VisibleSection =  <section className="area buffer">
                                    <p>We could not create your beer at this time</p>
                                    <div className="buttons">
                                        <button type="button"
                                                className="button secondary"
                                                onClick={() => this.viewForm()}>
                                            Try again
                                        </button>
                                    </div>
                                </section>
                break;
        }

        console.log('updated fill form count issssss', formFillCount)

        return (
            <div>
                <section className="area buffer page-title">
                    <h1>Add a Beer</h1>
                </section>
                {VisibleSection}
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
