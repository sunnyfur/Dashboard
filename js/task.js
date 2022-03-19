const moment = require("moment");
require('moment/locale/ru');
let ru = moment.locale('ru');
// module.exports = func = () => {
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


module.exports = {
    Task,
    listOfTasks
}