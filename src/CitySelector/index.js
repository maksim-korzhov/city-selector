import $ from 'jquery';
import Store from '../store';

import './style.less';

export default class CitySelector {
    constructor(configObj) {
        // Init props
        this.chooseRegionNode = null;
        this.chooseRegionListNode = null;
        this.chooseLocalityListNode = null;
        this.saveForm = null;
        this.saveButton = null;

        this.store = new Store(); // to store location data

        // Show block with region info
        this.infoBlock = $('#info');
        this.infoBlock.show();

        // Set config options
        this.elementId = configObj.elementId;
        this.regionsUrl = configObj.regionsUrl;
        this.localitiesUrl = configObj.localitiesUrl;
        this.saveUrl = configObj.saveUrl;

        this.layoutElementNode = $(`#${this.elementId}`);

        // Create button
        this.createRegionsSelector();
    }

    createRegionsSelector() {
        // Draw button
        this.chooseRegionNode = $('<button>').attr('id', 'chooseRegion').text('Выбрать регион');
        $(this.layoutElementNode).append(this.chooseRegionNode);

        // Get list of regions on click
        this.chooseRegionNode.on('click', () => {
            fetch(this.regionsUrl)
                .then(response => {
                    response.json().then(data => {
                        this.destroyRegionsSelector();
                        this.drawRegionsList(data);
                    });
                })
                .catch(() => {
                    //console.log('Не удалось получить список регионов');
                });
        });
    }

    destroyRegionsSelector() {
        if( this.chooseRegionNode ) {
            this.chooseRegionNode.remove();
            this.chooseRegionNode = null;
        }
    }

    drawRegionsList(regions) {
        this.chooseRegionListNode = $('<ul>').attr('id', 'chooseRegionList');

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
                        this.destroyLocalitiesList();
                        this.drawLocalitiesList(data);

                        // Store region and delete old locality
                        this.store.setRegion(regionId);

                        // Set data to send form
                        this.setValueForSend();

                        // Lock save button
                        this.lockButton();

                        // Highlight current region
                        this.chooseRegionListNode.find('.active').removeClass('active');
                        e.target.classList.add('active');
                    });
                })
                .catch(() => {
                    //console.log('Не удалось получить список населённый пунктов');
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

    drawLocalitiesList(localities) {
        this.chooseLocalityListNode = $('<ul>').attr('id', 'chooseLocalityList');

        localities.list.map((locality, i) => {
            const item = $('<li>').attr('data-loc', i).text(locality);
            this.chooseLocalityListNode.append(item);
        });

        this.chooseLocalityListNode.on('click', 'li', (e) => {
            this.store.setLocality(e.target.textContent);

            // Highlight current region
            this.chooseLocalityListNode.find('.active').removeClass('active');
            e.target.classList.add('active');

            this.setValueForSend();
            this.unlockButton();
        });

        this.layoutElementNode.append(this.chooseLocalityListNode);
        this.drawSaveForm();
    }

    destroyLocalitiesList() {
        if( this.chooseLocalityListNode ) {
            this.chooseLocalityListNode.remove();
            this.chooseLocalityListNode = null;

            this.destroySaveForm();
        }
    }

    drawSaveForm() {
        this.saveForm = $('<form>').attr('id', 'saveForm').attr('method', 'post').attr('action', this.saveUrl);

        // Combine data for server
        const region = $('<input>').attr({ type: 'hidden', name: 'region'}).val(this.store.getRegion());
        const locality = $('<input>').attr({ type: 'hidden', name: 'locality'}).val(this.store.getLocality());
        this.saveForm.append(region);
        this.saveForm.append(locality);

        this.saveButton = $('<input>').attr({type: 'submit', id: 'save', disabled: 'disabled'}).val('Сохранить');
        this.saveForm.append(this.saveButton);
        this.layoutElementNode.append(this.saveForm);
    }

    lockButton() {
        if(this.saveButton) {
            this.saveButton.attr('disabled', 'disabled');
        }
    }

    unlockButton() {
        if(this.saveButton) {
            this.saveButton.removeAttr('disabled');
        }
    }

    destroySaveForm() {
        if( this.saveForm ) {
            this.saveButton.remove();
            this.saveButton = null;

            this.saveForm.remove();
            this.saveForm = null;
        }
    }

    setValueForSend() {
        this.saveForm.find('input[name="region"]').val(this.store.getRegion());
        this.saveForm.find('input[name="locality"]').val(this.store.getLocality());
    }

    destroy() {
        // Delete info in store
        this.store.deleteLocality();
        this.store.deleteRegion();

        // Delete layout
        this.destroySaveButton();
        this.destroyLocalitiesList();
        this.destroyRegionsList();
        this.destroyRegionsSelector();

        // Hide block with region info
        this.infoBlock.hide();
    }
}
