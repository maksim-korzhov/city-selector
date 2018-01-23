import $ from 'jquery';
import Store from '../store';
import SaveForm from '../SaveForm';
import LocalityList from '../LocalityList';
import RegionsList from '../RegionsList';

import './style.less';

export default class CitySelector {
    constructor(configObj) {
        // Set config options
        this.elementId = configObj.elementId;
        this.regionsUrl = configObj.regionsUrl;
        this.localitiesUrl = configObj.localitiesUrl;
        this.saveUrl = configObj.saveUrl;

        this.layoutElementNode = $(`#${this.elementId}`);

        if( this.layoutElementNode.length === 0 ) {
            this.layoutElementNode  = $('<div>').attr({ id: this.elementId, class: 'citySelector' });
            $('#citySelector').append(this.layoutElementNode);
        }

        // Init props
        this.chooseRegionNode = null;
        this.chooseRegionListNode = null;
        this.chooseLocalityListNode = null;

        this.saveFormObj = new SaveForm(this.layoutElementNode);
        this.localityListObj = new LocalityList({
            saveFormObj: this.saveFormObj,
            saveUrl: this.saveUrl,
            chooseLocalityListNode: this.chooseLocalityListNode,
            layoutElementNode: this.layoutElementNode
        });
        this.regionsList = new RegionsList({
            chooseRegionListNode: this.chooseRegionListNode,
            localitiesUrl: this.localitiesUrl,
            localityListObj: this.localityListObj,
            saveFormObj: this.saveFormObj,
            layoutElementNode: this.layoutElementNode
        });

        this.store = new Store(); // to store location data

        // Show block with region info
        this.infoBlock = $('#info');
        this.infoBlock.show();

        // Create button
        this.createRegionsSelector();
    }

    createRegionsSelector() {
        // Draw button
        this.chooseRegionNode = $('<button>').attr('class', 'chooseRegion').text('Выбрать регион');
        $(this.layoutElementNode).append(this.chooseRegionNode);

        // Get list of regions on click
        this.chooseRegionNode.on('click', () => {
            fetch(this.regionsUrl)
                .then(response => {
                    response.json().then(data => {
                        this.destroyRegionsSelector();
                        this.regionsList.drawRegionsList(data);
                    });
                });
        });
    }

    destroyRegionsSelector() {
        if( this.chooseRegionNode ) {
            this.chooseRegionNode.remove();
            this.chooseRegionNode = null;
        }
    }

    destroy() {
        this.saveFormObj.destroySaveForm();
        this.localityListObj.destroyLocalitiesList();
        this.regionsList.destroyRegionsList();
        this.destroyRegionsSelector();

        // Destroy city selector
        if( this.layoutElementNode ) {
            this.layoutElementNode.remove();
            this.layoutElementNode = null;
        }
    }
}
