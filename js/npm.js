const moment = require("moment");
require('moment/locale/ru');
let ru = moment.locale('ru');


const Chart = require("chart.js");
const flatpickr = require("flatpickr");
require('flatpickr/dist/l10n/ru.js');


const getNameDay = (date) => {
    date = moment(date, 'DD.MM.YY').format("dddd");
    return date.charAt(0).toUpperCase() + date.slice(1)
}

const task = require('./task.js');
const listOfTasks = task.listOfTasks;
const tooltipModule = require('./tooltip.js');

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


const labels = task.Task.GetListOfDates(listOfTasks, dateFrom, dateTo);
const dataNews = task.Task.GetListOfNews(listOfTasks, dateFrom, dateTo);
const dataInProcess = task.Task.GetListOfInProcess(listOfTasks, dateFrom, dateTo);


const data = {
    labels: labels,
    datasets: [{
            label: 'Новая задача',
            barThickness: 45,
            backgroundColor: 'rgba(138, 43, 226, 1)',
            borderRadius: 5,

        },
        {
            label: 'В процессе',
            barThickness: 45,
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
    myChart.data.labels = task.Task.GetListOfDates(listOfTasks, dateFrom, dateTo);
    myChart.data.datasets[0].data = task.Task.GetListOfNews(listOfTasks, dateFrom, dateTo);
    myChart.data.datasets[1].data = task.Task.GetListOfInProcess(listOfTasks, dateFrom, dateTo);
    myChart.update();
}
refreshDataBar(listOfTasks, dateFrom, dateTo);


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
                external: tooltipModule.externalTooltipHandler
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
    myChartLine.data.labels = task.Task.GetListOfDates(listOfTasks, dateFrom, dateTo);
    myChartLine.data.datasets[0].data = task.Task.GetListOfAll(listOfTasks, dateFrom, dateTo);
    myChartLine.update();
}
refreshDataLine(listOfTasks, dateFrom, dateTo);


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



document.querySelector('.chart_line').addEventListener("mouseout", (e) => {
    myChartLine.update();
    triggerTooltip(myChartLine);
});

document.addEventListener("DOMContentLoaded", () => {

    document.querySelector(".date__day").innerHTML = getNameDay(moment());
    document.querySelector(".date__today").innerHTML = moment().format("DD MMMM YYYY");

});