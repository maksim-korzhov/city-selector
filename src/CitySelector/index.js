import $ from "jquery";
import Store from "../store";

import './style.less';

export default class CitySelector {
    constructor(configObj) {
        // Init props
        this.chooseRegionNode = null;
        this.chooseRegionListNode = null;
        this.chooseLocalityListNode = null;
        this.saveButton = null;

        this.store = new Store(); // to store location data

        // Show block with region info
        this.infoBlock = $("#info");
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
        this.chooseRegionNode = $("<button>").attr("id", "chooseRegion").text("Выбрать регион");
        $(this.layoutElementNode).append(this.chooseRegionNode);

        // Get list of regions on click
        this.chooseRegionNode.on("click", () => {
            fetch(this.regionsUrl)
                .then(response => {
                    response.json().then(data => {
                        this.destroyRegionsSelector();
                        this.drawRegionsList(data);
                    });
                })
                .catch(() => {
                    console.log("Не удалось получить список регионов");
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
        this.chooseRegionListNode = $("<ul>").attr("id", "chooseRegionList");

        regions.map(region => {
            let item = $("<li>").attr("data-region", region.id).text(region.title);
            this.chooseRegionListNode.append(item);
        });

        this.chooseRegionListNode.on("click", "li", (e) => {
            const regionId = e.target.dataset.region;

            // Get data about region
            fetch(`${this.localitiesUrl}/${regionId}`)
                .then(response => {
                    response.json().then(data => {
                        // Delete old nodes with localities
                        this.destroyLocalitiesList();
                        this.drawLocalitiesList(data);
                        this.setRegion(regionId);
                    });
                })
                .catch(() => {
                    console.log("Не удалось получить список регионов");
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

    setRegion(regionId) {

    }

    drawLocalitiesList(localities) {
        this.chooseLocalityListNode = $("<ul>").attr("id", "chooseLocalityList");

        localities.list.map((locality, i) => {
            let item = $("<li>").attr("data-loc", i).text(locality);
            this.chooseLocalityListNode.append(item);
        });

        this.layoutElementNode.append(this.chooseLocalityListNode);
        this.drawSaveButton();
    }

    destroyLocalitiesList() {
        if( this.chooseLocalityListNode ) {
            this.chooseLocalityListNode.remove();
            this.chooseLocalityListNode = null;
        }
    }

    drawSaveButton() {
        this.saveButton = $("<button>").attr("id", "save").attr("disabled", "disabled").text("Сохранить");
        this.layoutElementNode.append(this.saveButton);
    }

    destroySaveButton() {
        if( this.saveButton ) {
            this.saveButton.remove();
            this.saveButton = null;
        }
    }

    destroy() {
        this.destroySaveButton();
        this.destroyLocalitiesList();
        this.destroyRegionsList();
        this.destroyRegionsSelector();

        // Hide block with region info
        this.infoBlock.hide();
    }
}
