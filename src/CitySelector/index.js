import $ from "jquery";

import './style.less';

export default class CitySelector {
    constructor(configObj) {
        // Init props
        this.chooseRegionNode = null;

        // Show block with region info
        this.infoBlock = $("#info");
        this.infoBlock.show();

        // Set config options
        this.elementId = configObj.elementId;
        this.regionsUrl = configObj.regionsUrl;
        this.localitiesUrl = configObj.localitiesUrl;
        this.saveUrl = configObj.saveUrl;

        // Create button
        this.createRegionsSelector();
    }

    createRegionsSelector() {
        // Draw button
        this.chooseRegionNode = $("<button>").attr("id", "chooseRegion").text("Выбрать регион");
        $(`#${this.elementId}`).append(this.chooseRegionNode)

        this.chooseRegionNode.on("click", () => {
            fetch(this.regionsUrl)
                .then(response => {
                    response.json().then(data => console.log(data));
                    return response.json();
                })
                .catch(() => {
                    console.log("Не удалось получить список регионов");
                });
        });
    }

    destroy() {
        // Hide block with region info
        this.infoBlock.hide();
    }
}
