const moment = require("moment");
require('moment/locale/ru');
let ru = moment.locale('ru');

const Chart = require("chart.js");
// const datePicker = require("js-datepicker");
const flatpickr = require("flatpickr");
require('flatpickr/dist/l10n/ru.js');

const getDay = (date) => {
    return moment(date, 'DD.MM.YY').format("DD");
};
const getNameDay = (date) => {
    date = moment(date, 'DD.MM.YY').format("dddd");

    return date.charAt(0).toUpperCase() + date.slice(1)
}


class Task {
    constructor(date, countNew, countInProcess) {
        this.date = date;
        this.countNew = countNew;
        this.countInProcess = countInProcess;
    }
    static GetListOfDates(listOfTasks, dateFrom, dateTo) {

        return Task.GetListOfCurrent(listOfTasks, dateFrom, dateTo).map(elem => elem.date);
    }
    static GetListOfNews(listOfTasks, dateFrom, dateTo) {
        return Task.GetListOfCurrent(listOfTasks, dateFrom, dateTo).map(elem => elem.countNew);
    }
    static GetListOfInProcess(listOfTasks, dateFrom, dateTo) {
        return Task.GetListOfCurrent(listOfTasks, dateFrom, dateTo).map(elem => [
            elem.countNew, elem.countInProcess + elem.countNew
        ]);
    }
    static GetListOfAll(listOfTasks, dateFrom, dateTo) {
        return Task.GetListOfCurrent(listOfTasks, dateFrom, dateTo).map(elem =>
            elem.countInProcess + elem.countNew);
    }

    static GetListOfCurrent(listOfTasks, dateFrom, dateTo) {
        if (!dateTo) {
            if (!dateFrom)
                return listOfTasks.slice(-7);
            else
                return listOfTasks.filter(elem => moment(elem.date, 'DD.MM.YY').isAfter(moment(dateFrom, 'DD.MM.YY')));
        }
        return listOfTasks.filter(elem => moment(elem.date, 'DD.MM.YY').isBetween(moment(dateFrom, 'DD.MM.YY'), moment(dateTo, 'DD.MM.YY'), undefined, '[]'));
    }


}

const listOfTasks = [];
listOfTasks.push(new Task('28.02.22', 10, 0));
listOfTasks.push(new Task('01.03.22', 20, 30));
listOfTasks.push(new Task('02.03.22', 50, 10));
listOfTasks.push(new Task('03.03.22', 20, 20));
listOfTasks.push(new Task('04.03.22', 40, 10));
listOfTasks.push(new Task('05.03.22', 20, 10));
listOfTasks.push(new Task('06.03.22', 30, 20));
listOfTasks.push(new Task('07.03.22', 10, 0));
listOfTasks.push(new Task('08.03.22', 20, 30));
listOfTasks.push(new Task('09.03.22', 50, 10));
listOfTasks.push(new Task('10.03.22', 20, 20));
listOfTasks.push(new Task('11.03.22', 40, 10));
listOfTasks.push(new Task('12.03.22', 20, 10));
listOfTasks.push(new Task('13.03.22', 30, 20));
listOfTasks.push(new Task('14.03.22', 10, 0));
listOfTasks.push(new Task('15.03.22', 20, 30));
listOfTasks.push(new Task('16.03.22', 50, 10));
listOfTasks.push(new Task('17.03.22', 20, 20));
listOfTasks.push(new Task('18.03.22', 40, 10));
listOfTasks.push(new Task('19.03.22', 20, 10));
listOfTasks.push(new Task('20.03.22', 30, 20));


let dateFrom = moment().subtract(7, 'd');
let dateTo = moment();

const ChangeCharts = (selectedDates, dateStr, instance) => {
    dateFrom = selectedDates[0];
    dateTo = selectedDates[1];

    refreshDataBar(listOfTasks, dateFrom, dateTo);
    refreshDataLine(listOfTasks, dateFrom, dateTo);
    triggerTooltip(myChartLine)
}

const picker = flatpickr(".dateInput", {
    mode: "range",
    locale: "ru",
    defaultDate: [dateFrom.format("DD.MM.YY"), dateTo.format("DD.MM.YY")],
    dateFormat: "d.m.Y",

    onClose: ChangeCharts,
});




const ctx = document.getElementById('myChart').getContext('2d');
const ctxLine = document.getElementById('myLineChart').getContext('2d');




const labels = Task.GetListOfDates(listOfTasks, dateFrom, dateTo);
const dataNews = Task.GetListOfNews(listOfTasks, dateFrom, dateTo);
const dataInProcess = Task.GetListOfInProcess(listOfTasks, dateFrom, dateTo);




const data = {
    labels: labels,
    datasets: [{
            label: 'Новая задача',
            barThickness: 45,
            // data: dataNews,
            backgroundColor: 'rgba(138, 43, 226, 1)',
            borderRadius: 5,

        },
        {
            label: 'В процессе',
            barThickness: 45,
            // data: dataInProcess,
            backgroundColor: 'rgba(255, 180, 180, 1)',
            borderRadius: 5,

        },

    ]
};

const myChart = new Chart(ctx, {

    type: 'bar',
    data: data,
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Задачи',
                align: 'start',
                font: {
                    size: 30
                },
                padding: {
                    top: 20,
                    left: 0,
                    right: 0,
                    bottom: 20

                }

            },
            legend: {
                align: 'end',
                padding: 50,

                labels: {
                    font: {
                        size: 15

                    },
                    usePointStyle: true,
                },
            }
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                }
            },
            y: {
                grid: {
                    display: false,
                },
                suggestedMax: 70
            },
        }
    }
});

const refreshDataBar = (listOfTasks, dateFrom, dateTo) => {
    myChart.data.labels = Task.GetListOfDates(listOfTasks, dateFrom, dateTo);
    myChart.data.datasets[0].data = Task.GetListOfNews(listOfTasks, dateFrom, dateTo);
    myChart.data.datasets[1].data = Task.GetListOfInProcess(listOfTasks, dateFrom, dateTo);
    myChart.update();
}
refreshDataBar(listOfTasks, dateFrom, dateTo);

const externalTooltipHandler = (context) => {
    // Tooltip Element
    const {
        chart,
        tooltip
    } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    // Hide if no tooltip
    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    // Set Text
    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map(b => b.lines);

        const tableHead = document.createElement('div');
        tableHead.classList.add("tooltip__text");
        tableHead.classList.add("tooltip__text_bottom");

        titleLines.forEach(title => {
            const tr = document.createElement('p');
            tr.style.borderWidth = 0;
            const th = document.createElement('p');
            th.style.borderWidth = 0;
            th.innerHTML = getDay(title);
            tr.appendChild(th);
            tableHead.appendChild(tr);
        });

        const tableBody = document.createElement('div');
        tableBody.classList.add("tooltip__text");
        bodyLines.forEach((body, i) => {

            const valP = document.createElement('p');
            valP.classList.add("tooltip__header");
            const text = document.createTextNode(body);
            valP.innerText = tooltip.dataPoints[i].parsed.y;

            const valH = document.createElement('p');
            valH.classList.add("tooltip__subheader");
            valH.innerHTML = tooltip.dataPoints[i].dataset.label;

            tableBody.appendChild(valP);
            tableBody.appendChild(valH);
        });

        const tableRoot = tooltipEl.querySelector('.tooltip');

        // Remove old children
        while (tableRoot.firstChild) {
            tableRoot.firstChild.remove();
        }

        // Add new children
        tableRoot.appendChild(tableHead);
        tableRoot.appendChild(tableBody);
    }

    const {
        offsetLeft: positionX,
        offsetTop: positionY
    } = chart.canvas;
    // Display, position, and set styles for font
    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    tooltipEl.style.top = positionY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    // tooltipEl.style.height = chart.ChartArea + 'px';
    tooltipEl.style.width = 150 + 'px';
    // tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};


const grad = document.createElement("canvas").getContext('2d');
let ct = grad.createLinearGradient(0, 0, 0, 400);
ct.addColorStop(0, 'rgba(138, 43, 226,1)');
ct.addColorStop(1, 'rgba(138,43,226,0)');

const dataLine = {
    labels: labels,
    datasets: [{
        label: 'Задачи',
        fill: false,
        borderColor: 'rgb(138, 43, 226)',
        backgroundColor: ct,
        // cubicInterpolationMode: 'monotone',
        fill: true,
        tension: 0.4,
        type: 'line',
        pointStyle: "circle",
        pointRadius: 0,
        pointBorderWidth: 25,
        pointHoverBorderWidth: 50,
        pointHoverRadius: 10,
        pointBackgroundColor: 'rgba(255, 180, 180, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 0.5)',
    }]
};

const myChartLine = new Chart(ctxLine, {
    type: 'bar',
    data: dataLine,
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Недельная Активность',
                align: 'start',
                font: {
                    size: 30
                },
                padding: {
                    top: 20,
                    left: 0,
                    right: 0,
                    bottom: 50

                }
            },
            legend: {
                display: false,

            },
            tooltip: {
                enabled: false,
                // position: 'nearest',
                external: externalTooltipHandler
            }


        },

        responsive: true,
        interaction: {
            intersect: false,
            mode: 'index',
        },
        scales: {
            x: {

                stacked: true,
                grid: {
                    display: false
                },
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return getNameDay(this.getLabelForValue(value));
                    }
                }
            },
            y: {
                display: false,
                min: -10,
                max: 100,
            }
        }
    }
})

const refreshDataLine = (listOfTasks, dateFrom, dateTo) => {
    myChartLine.data.labels = Task.GetListOfDates(listOfTasks, dateFrom, dateTo);
    myChartLine.data.datasets[0].data = Task.GetListOfAll(listOfTasks, dateFrom, dateTo);
    myChartLine.update();
}
refreshDataLine(listOfTasks, dateFrom, dateTo);


let count = 0;
const triggerTooltip = (chart) => {
    chart.setActiveElements([{
        datasetIndex: 0,
        index: Math.floor(moment(dateTo).diff(dateFrom, "days") / 2) || 0,
    }, ]);

    chart.tooltip.setActiveElements([{
        datasetIndex: 0,
        index: Math.floor(moment(dateTo).diff(dateFrom, "days") / 2) || 0,
    }, ]);
    chart.update();
};

triggerTooltip(myChartLine);

const upd = (chart) => {
    chart.update();
}


document.querySelector('.chart_line').addEventListener("mouseout", (e) => {
    upd(myChartLine);
    triggerTooltip(myChartLine);
});

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".date__day").innerHTML = getNameDay(moment());
    document.querySelector(".date__today").innerHTML = moment().format("DD MMMM YYYY");

});