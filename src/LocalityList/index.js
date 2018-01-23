import $ from 'jquery';
import Store from '../store';

export default class LocalityList {
    constructor(configObj) {
        this.store = new Store();
        this.saveFormObj = configObj.saveFormObj;
        this.saveUrl = configObj.saveUrl;
        this.chooseLocalityListNode = configObj.chooseLocalityListNode;
        this.layoutElementNode = configObj.layoutElementNode;
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

            this.saveFormObj.setValueForSend();
            this.saveFormObj.unlockButton();
        });

        this.layoutElementNode.append(this.chooseLocalityListNode);
        this.saveFormObj.drawSaveForm(this.saveUrl);
    }

    destroyLocalitiesList() {
        if( this.chooseLocalityListNode ) {
            this.chooseLocalityListNode.remove();
            this.chooseLocalityListNode = null;

            this.saveFormObj.destroySaveForm();
        }
    }
}
