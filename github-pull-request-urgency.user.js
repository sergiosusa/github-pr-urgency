// ==UserScript==
// @name         Github Pull Request Urgency
// @namespace    https://sergiosusa.com
// @version      0.1
// @description  Add some border color to pull request by urgency configuration.
// @author       Sergio Susa (https://sergiosusa.com)
// @match        https://github.com/*/pulls
// @match        https://github.com/pulls*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let pullRequestUrgency = new PullRequestUrgency();
    pullRequestUrgency.init();

})();

function PullRequestUrgency() {

    this.BLUE = '#117EFF';
    this.GREEN = '#0EC600';
    this.ORANGE = '#FF9800';
    this.RED = '#FE0900';

    this.init = () => {

        let urgencyConfiguration = this.load();

        let low = urgencyConfiguration[0];
        let medium = urgencyConfiguration[1];
        let high = urgencyConfiguration[2];

        this.addConfigurator(low, medium, high);
        this.printUrgency(low, medium, high);

    };

    this.load = () => {

        let urgencyConfiguration = JSON.parse(localStorage.getItem('github_urgency'));

        if (null === urgencyConfiguration) {
            urgencyConfiguration = [2, 4, 8];
        }

        return urgencyConfiguration;
    };

    this.save = () => {

        let lowDays = document.getElementById('lowDays').value;
        let mediumDays = document.getElementById('mediumDays').value;
        let highDays = document.getElementById('highDays').value;

        localStorage.setItem('github_urgency', JSON.stringify([
            lowDays,
            mediumDays,
            highDays
        ]));

        location.reload();
    };

    this.addConfigurator = (low, medium, high) => {

        let html = '<div style="background-color:' + this.BLUE + ';width:60px;height:27px;margin-right: 10px;">' +
            '<input style="width:30px;text-align: center;" type="text" value="0" disabled></div>' +
            '<div style="background-color:' + this.GREEN + ';width:60px;height:27px;margin-right: 10px;">' +
            '<input id="lowDays" style="width:30px;text-align: center;" type="text" value="' + low + '"></div>' +
            '<div style="background-color:' + this.ORANGE + ';width:60px;height:27px;margin-right: 10px;">' +
            '<input id="mediumDays" style="width: 30px;text-align: center;" type="text" value="' + medium + '" ></div>' +
            '<div style="background-color:' + this.RED + ';width:60px;height:27px;margin-right: 10px;">' +
            '<input id="highDays" style="width: 30px;text-align: center;" type="text" value="' + high + '"></div>' +
            '<button type="button" id="save_btn" class="btn btn-sm" >Save</button>';

        let iDiv = document.createElement('div');
        iDiv.id = 'configutarion';
        iDiv.style.display = 'inline-flex';
        iDiv.style.justifyContent = 'flex-end';
        iDiv.style.width = '100%';
        iDiv.style.textAlign = 'end';
        iDiv.innerHTML = html;

        document.getElementById("js-issues-toolbar").parentNode.insertBefore(iDiv, document.getElementById("js-issues-toolbar"));

        let saveBtn = document.getElementById('save_btn');
        saveBtn.onclick = this.save;

    };

    this.printUrgency = (low, medium, high) => {

        let today = new Date();
        let openPullRequestsDate = document.getElementsByTagName("relative-time");

        for (let x = 0; x < openPullRequestsDate.length; x++) {
            let pullRequestDate = new Date(openPullRequestsDate[x].getAttribute("datetime"));
            let timeDiffOnMilliseconds = Math.abs(pullRequestDate.getTime() - today.getTime());
            let timeDiffOnDays = Math.ceil(timeDiffOnMilliseconds / (1000 * 3600 * 24));

            let color;

            if (timeDiffOnDays >= 0 && timeDiffOnDays <= low) {
                color = this.BLUE;
            }

            if (timeDiffOnDays > low && timeDiffOnDays <= medium) {
                color = this.GREEN;
            }

            if (timeDiffOnDays > medium && timeDiffOnDays <= high) {
                color = this.ORANGE;
            }

            if (timeDiffOnDays > high) {
                color = this.RED;
            }

            this.drawNode(openPullRequestsDate[x].parentNode.parentNode.parentNode.parentNode, color);
        }
    };

    this.drawNode = (node, color) => {
        node.style.borderColor = color;
        node.style.borderStyle = 'solid';
        node.borderBottomWidth = 'thin';
        node.style.borderTopWidth = 'thin';
    }

}
