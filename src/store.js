import $ from "jquery";

export default class Store {
    constructor() {
        // Set info nodes
        this.regionNode =  $("#regionText");
        this.localityNode =  $("#localityText");
    }

    saveRegion(regionId) {
        this.regionNode.text(regionId);
        this.localityNode.text('');
    }

    getRegion() {
        return this.regionNode.text();
    }

    deleteRegion() {
        this.regionNode.text('');
        this.localityNode.text('');
    }

    saveLocality(locality) {
        this.localityNode.text(locality);
    }

    getLocality() {
        return this.localityNode.text();
    }

    deleteLocality() {
        this.localityNode.text('');
    }
}
