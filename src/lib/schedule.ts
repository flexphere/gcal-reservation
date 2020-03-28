import * as moment from 'moment';

export class Schedule {
    dates = [];
    constructor(date_from: string, date_to: string){
        const curr = moment(date_from);
        const to = moment(date_to);
        while (curr.isBefore(to)) {
            if ([0, 6].includes(curr.day())) {
                this.dates.push(new Timetable(curr, 10, 18, 1, true));
            } else {
                this.dates.push(new Timetable(curr, 10, 18, 1, false));
            }
            curr.add(1, 'days');
        }
    }

    getTimelines() {
        return this.dates;
    }

    disableTimeRange(from: string, to: string) {
        console.log('disableTimeRange');
        const time_from = moment(from).unix();
        const time_to = moment(to).unix();

        const mmdd = moment(from).format('M/D(ddd)');
        const timetable = this.find(mmdd);
        timetable.events = timetable.events.map(event => {
            if (event.start <= time_to && event.end >= time_from) {
                event.disable();
            }
            return event;
        });
    }

    find(date: string) {
        return this.dates.find(t => t.date === date)
    }
}

export class Timetable {
    date: string;
    events = [];
    constructor(date: moment.Moment, time_start = 10, time_end = 18, period = 1, disabled = false) {
        this.date = date.format('M/D(ddd)');
        for (let i = time_start; i < time_end; i++) {
            const start = moment(date).hour(i).minute(0);
            const end = moment(start).add(period, 'hours').add(-1, 'minutes');
            const event = new Event(start.format('HH:mm〜'), start.unix(), end.unix(), disabled);
            this.events.push(event);
        }
    }
}

export class Event {
    constructor(
        public label = '',
        public start: number,
        public end:  number,
        public disabled: boolean = false,
    ) {}

    disable() {
        this.disabled = true;
    }
}