import $ from 'jquery';
import Store from '../store';

import './style.less';

export default class SaveForm {
    constructor(layoutElementNode) {
        this.saveFormNode = null;
        this.saveButtonNode = null;

        this.store = new Store();
        this.layoutElementNode = layoutElementNode;
    }

    drawSaveForm(saveUrl) {
        this.saveFormNode = $('<form>').attr({ id: 'saveForm', class: 'saveForm', method: 'post', action: saveUrl});

        // Combine data for server
        const region = $('<input>').attr({ type: 'hidden', name: 'region'}).val(this.store.getRegion());
        const locality = $('<input>').attr({ type: 'hidden', name: 'locality'}).val(this.store.getLocality());
        this.saveFormNode.append(region);
        this.saveFormNode.append(locality);

        this.saveButtonNode = $('<input>').attr({type: 'submit', id: 'save', disabled: 'disabled'}).val('Сохранить');
        this.saveFormNode.append(this.saveButtonNode);
        this.layoutElementNode.append(this.saveFormNode);
    }

    lockButton() {
        if(this.saveButtonNode) {
            this.saveButtonNode.attr('disabled', 'disabled');
        }
    }

    unlockButton() {
        if(this.saveButtonNode) {
            this.saveButtonNode.removeAttr('disabled');
        }
    }

    destroySaveForm() {
        if( this.saveFormNode ) {
            this.saveButtonNode.remove();
            this.saveButtonNode = null;

            this.saveFormNode.remove();
            this.saveFormNode = null;
        }
    }

    setValueForSend() {
        this.saveFormNode.find('input[name="region"]').val(this.store.getRegion());
        this.saveFormNode.find('input[name="locality"]').val(this.store.getLocality());
    }
}
