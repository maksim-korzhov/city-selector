import $ from 'jquery';
import Store from './store';
import CitySelector from './CitySelector';

class App {
    constructor() {
        this.citySelector = [];
        this.store = new Store();
    }

    createCitySelector(id) {
        this.citySelector.push(new CitySelector({
            elementId: `citySelector${id}`,
            regionsUrl: 'http://localhost:3000/regions',
            localitiesUrl: 'http://localhost:3000/localities',
            saveUrl: 'http://localhost:3000/selectedRegions'
        }));
    }

    destroyCitySelector() {
        if(this.citySelector.length > 0) {
            this.citySelector[this.citySelector.length - 1].destroy();
            this.citySelector.pop();
        }

        if( this.citySelector.length === 0 ) {
            // Hide block with region info
            $('#info').hide();

            // Delete info about selected regions
            this.store.deleteLocality();
            this.store.deleteRegion();
        }
    }

    init() {
        $('#createCitySelector').on('click', () => {
            this.createCitySelector(this.citySelector.length);
        });

        $('#destroyCitySelector').on('click', () => {
            this.destroyCitySelector();
        });
    }
}

const AppInstance = new App();
AppInstance.init();
