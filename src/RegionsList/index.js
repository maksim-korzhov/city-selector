import $ from 'jquery';
import Store from '../store';

export default class RegionsList {
    constructor(configObj) {
        this.store = new Store();

        this.chooseRegionListNode = configObj.chooseRegionListNode;
        this.localitiesUrl = configObj.localitiesUrl;
        this.localityListObj = configObj.localityListObj;
        this.saveFormObj = configObj.saveFormObj;
        this.layoutElementNode = configObj.layoutElementNode;
    }

    drawRegionsList(regions) {
        this.chooseRegionListNode = $('<ul>').attr('class', 'chooseRegionList');

        regions.map(region => {
            const item = $('<li>').attr('data-region', region.id).text(region.title);
            this.chooseRegionListNode.append(item);
        });

        this.chooseRegionListNode.on('click', 'li', (e) => {
            const regionId = e.target.dataset.region;

            // Get data about region
            fetch(`${this.localitiesUrl}/${regionId}`)
                .then(response => {
                    response.json().then(data => {
                        // Delete old nodes with localities
                        this.localityListObj.destroyLocalitiesList();
                        this.localityListObj.drawLocalitiesList(data, regionId);

                        // Store region and delete old locality
                        this.store.setRegion(regionId);

                        // Set data to send form
                        this.saveFormObj.setValueForSend();

                        // Lock save button
                        this.saveFormObj.lockButton();

                        // Highlight current region
                        this.chooseRegionListNode.find('.active').removeClass('active');
                        e.target.classList.add('active');
                    });
                })
                .catch(() => {
                    // error message
                });
        });

        this.layoutElementNode.append(this.chooseRegionListNode);
    }

    destroyRegionsList() {
        if( this.chooseRegionListNode ) {
            this.chooseRegionListNode.remove();
            this.chooseRegionListNode = null;
        }
    }
}
