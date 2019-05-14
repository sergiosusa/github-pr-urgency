// ==UserScript==
// @name         Github Pull Request Urgency
// @namespace    https://sergiosusa.com
// @version      0.3
// @description  Add some border color to pull request by urgency configuration.
// @author       Sergio Susa (https://sergiosusa.com)
// @match        https://github.com/*/pulls*
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
    this.GRAY = '#E1E4E8';
    this.PEACH = 'rgba(245, 234, 212, 0.7)';

    this.init = () => {

        let urgencyConfiguration = this.load();

        let low = urgencyConfiguration[0];
        let medium = urgencyConfiguration[1];
        let high = urgencyConfiguration[2];
        let reloadTime = urgencyConfiguration[3];

        this.addConfigurator(low, medium, high, reloadTime);
        this.processPullRequests(low, medium, high);
        this.formatAssignees();
        this.setReloadTimer(reloadTime);

    };

    this.load = () => {

        let urgencyConfiguration = JSON.parse(localStorage.getItem('github_urgency'));

        if (null === urgencyConfiguration) {
            urgencyConfiguration = [2, 4, 8, 1];
        }

        return urgencyConfiguration;
    };

    this.save = () => {

        let lowDays = document.getElementById('lowDays').value;
        let mediumDays = document.getElementById('mediumDays').value;
        let highDays = document.getElementById('highDays').value;
        let reloadHours = document.getElementById('reloadHours').value;

        localStorage.setItem('github_urgency', JSON.stringify([
            lowDays,
            mediumDays,
            highDays,
            reloadHours
        ]));

        location.reload();
    };

    this.addConfigurator = (low, medium, high, reloadTime) => {

        let html = '<div style="width:130px;height:27px;margin-right: 10px;">Reload (hours) <input id="reloadHours" style="width:30px;text-align: center;" type="text" value="' + reloadTime + '"></div>' +
            '<div style="background-color:' + this.BLUE + ';width:60px;height:27px;margin-right: 10px;">' +
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

    this.processPullRequests = (low, medium, high) => {

        let pullRequestList = document.querySelectorAll(".Box-row");

        pullRequestList.forEach(pullRequest => {
            let isDraft = pullRequest
                .getElementsByClassName('opened-by')[0]
                .nextElementSibling
                .innerHTML.includes('Draft');

            if (isDraft) {
                this.printDraft(pullRequest);
            } else {
                this.printUrgency(pullRequest, low, medium, high);
            }
        });
        
    }

    this.printUrgency = (pullRequest, low, medium, high) => {

        let today = new Date();

        let openPullRequestsDate = pullRequest.getElementsByTagName("relative-time")[0];

        let pullRequestDate = new Date(openPullRequestsDate.getAttribute("datetime"));
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

        this.drawNode(pullRequest, color);
    };

    this.printDraft = (pullRequest) => {
        let color = this.GRAY;
        let backgroundColor = this.PEACH;

        this.drawNode(pullRequest, color, backgroundColor);
    }

    this.drawNode = (node, color, backgroundColor) => {
        node.style.borderColor = color;
        node.style.borderStyle = 'solid';
        node.style.borderBottomWidth = 'thin';
        node.style.borderTopWidth = 'thin';

        if (backgroundColor) {
            node.style.backgroundColor = backgroundColor;
        }
    }

    this.setReloadTimer = (reloadTime) => {

        setTimeout(() => {
            location.reload();
        }, reloadTime * 60 * 60 * 1000);

    };

    this.formatAssignees = () => {

        let assignees = document.querySelectorAll("div > a.avatar > img");

        for (let x = 0; x < assignees.length; x++) {
            assignees[x].setAttribute('width', '50px');
            assignees[x].setAttribute('height', '50px');
            assignees[x].parentElement.style.height = '50px';
            assignees[x].parentElement.style.width = '50px';
            assignees[x].parentElement.style.marginTop = '-10px';
        }
    };

}
