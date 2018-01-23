import $ from "jquery";
import CitySelector from './CitySelector';

class App {
    constructor() {
        this.citySelector = null;
    }

    createCitySelector() {
        this.citySelector = new CitySelector({
            elementId: 'citySelector',
            regionsUrl: 'http://localhost:3000/regions',
            localitiesUrl: 'http://localhost:3000/localities',
            saveUrl: 'http://localhost:3000/selectedRegions'
        });
    }

    destroyCitySelector() {
        this.citySelector.destroy();
        this.citySelector = null;
    }

    init() {
        $("#createCitySelector").on("click", () => {
            this.createCitySelector();
        });

        $("#destroyCitySelector").on("click", () => {
            this.destroyCitySelector();
        });
    }
}

const AppInstance = new App();
AppInstance.init();
