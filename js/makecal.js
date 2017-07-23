/**
 * Created by Ishan on 1/07/2017.
 */
//ics formatter libarary :)
    //https://github.com/matthiasanderer/icsFormatter
var icsFormatter = function () {
        'use strict';

        if (navigator.userAgent.indexOf('MSIE') > -1 && navigator.userAgent.indexOf('MSIE 10') == -1) {
            ////console.log('Unsupported Browser');
            return;
        }

        var SEPARATOR = (navigator.appVersion.indexOf('Win') !== -1) ? '\r\n' : '\n';
        var calendarEvents = [];
        var calendarStart = [
            'BEGIN:VCALENDAR',
            'PRODID:-//Unilyf Monash//learntog.github.io//EN',
            'X-WR-TIMEZONE:Australia/Melbourne',
            'X-WR-CALNAME:Monash-Timetable',
            'VERSION:2.0'
        ].join(SEPARATOR);
        var calendarEnd = SEPARATOR + 'END:VCALENDAR';

        return {
            /**
             * Returns events array
             * @return {array} Events
             */
            'events': function () {
                return calendarEvents;
            },

            /**
             * Returns calendar
             * @return {string} Calendar in iCalendar format
             */
            'calendar': function () {
                return calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
            },

            /**
             * Add event to the calendar
             * @param  {string} subject     Subject/Title of event
             * @param  {string} description Description of event
             * @param  {string} location    Location of event
             * @param  {string} begin       Beginning date of event
             * @param  {string} stop        Ending date of event
             */
            'addEvent': function (subject, description, location, begin, stop) {
                // I'm not in the mood to make these optional... So they are all required
                if (typeof subject === 'undefined' ||
                    typeof description === 'undefined' ||
                    typeof location === 'undefined' ||
                    typeof begin === 'undefined' ||
                    typeof stop === 'undefined'
                ) {
                    return false;
                }

                //TODO add time and time zone? use moment to format?
                var start_date = new Date(begin);
                var end_date = new Date(stop);

                var start_year = ("0000" + (start_date.getFullYear().toString())).slice(-4);
                var start_month = ("00" + ((start_date.getMonth() + 1).toString())).slice(-2);
                var start_day = ("00" + ((start_date.getDate()).toString())).slice(-2);
                var start_hours = ("00" + (start_date.getHours().toString())).slice(-2);
                var start_minutes = ("00" + (start_date.getMinutes().toString())).slice(-2);
                var start_seconds = ("00" + (start_date.getMinutes().toString())).slice(-2);

                var end_year = ("0000" + (end_date.getFullYear().toString())).slice(-4);
                var end_month = ("00" + ((end_date.getMonth() + 1).toString())).slice(-2);
                var end_day = ("00" + ((end_date.getDate()).toString())).slice(-2);
                var end_hours = ("00" + (end_date.getHours().toString())).slice(-2);
                var end_minutes = ("00" + (end_date.getMinutes().toString())).slice(-2);
                var end_seconds = ("00" + (end_date.getMinutes().toString())).slice(-2);

                // Since some calendars don't add 0 second events, we need to remove time if there is none...
                var start_time = '';
                var end_time = '';
                if (start_minutes + start_seconds + end_minutes + end_seconds !== 0) {
                    start_time = 'T' + start_hours + start_minutes + start_seconds;
                    end_time = 'T' + end_hours + end_minutes + end_seconds;
                }

                var start = start_year + start_month + start_day + start_time;
                var end = end_year + end_month + end_day + end_time;

                var a = false;
                //document.getElementById("clayton-addresses").checked;
                a = true;
                if (a) {
                    //console.log("melbourne zone forced");
                    var calendarEvent = [
                        'BEGIN:VEVENT',
                        'CLASS:PUBLIC',
                        'DESCRIPTION:' + description,
                        'DTSTART;TZID=Australia/Melbourne:' + start,
                        'DTEND;TZID=Australia/Melbourne:' + end,
                        'LOCATION:' + location,
                        'SUMMARY;LANGUAGE=en-us:' + subject,
                        'TRANSP:TRANSPARENT',
                        'END:VEVENT'
                    ].join(SEPARATOR);
                } else {
                    //console.log("auto time select");
                    var calendarEvent = [
                        'BEGIN:VEVENT',
                        'CLASS:PUBLIC',
                        'DESCRIPTION:' + description,
                        'DTSTART:' + start,
                        'DTEND:' + end,
                        'LOCATION:' + location,
                        'SUMMARY;LANGUAGE=en-us:' + subject,
                        'TRANSP:TRANSPARENT',
                        'END:VEVENT'
                    ].join(SEPARATOR);
                }

                calendarEvents.push(calendarEvent);
                return calendarEvent;
            },


            'download': function (filename, ext, what) {
                if (calendarEvents.length < 1) {
                    return false;
                }

                ext = (typeof ext !== 'undefined') ? ext : '.ics';
                filename = (typeof filename !== 'undefined') ? filename : 'calendar';
                var calendar = calendarStart + SEPARATOR + calendarEvents.join(SEPARATOR) + calendarEnd;
                // //console.log(calendar);

                if (what == "download") {
                    window.open("data:text/calendar;charset=utf8," + escape(calendar));
                }
                return calendar;
            }
        };
    };


function make(ab, what) {
    var calEntry = icsFormatter();
    // text = document.getElementById("csvValues").value;


    for (var c in ab) {
        var subjectCode, desc, group, activity, day, time, campus, location, staff, duration, dates;
        var arraydata = c.split("*");
        subjectCode = arraydata[0];
        desc = "";
        group = "";
        activity = arraydata[1];
        day = arraydata[2];
        time = arraydata[3];
        campus = "";
        location = arraydata[4];
        staff = "";
        duration = arraydata[5].replace("~", ".");
        dates = ab[c].replace(",", "");

        //console.log(location);

        //constants
        var tab = "\t";
        var newline = "\n";

        var title = subjectCode + tab + desc + tab + group + activity;
        var place = location.substr(0, location.indexOf("/"));

        var finalLoc = location;

        //console.log();

        var year, month, date, hours, minutes, seconds, milliseconds;
        seconds = 0;
        milliseconds = 0;

        //TODO update year based on date rather than fix definition
        year = 2017;

        var lessionDates = dates.split(" ");
        for (q = 0; q < lessionDates.length; q++) {

            if (lessionDates[q].indexOf("-") >= 0) {
                var range = lessionDates[q].split('-');
                var d, m;
                var s = range[0].split("/");

                //('0' + deg).slice(-2) - stackoverflow

                d = ('0' + s[0]).slice(-2);
                m = ('0' + s[1]).slice(-2);

                var tData = time.split(":");

                hours = tData[0];
                minutes = tData[1];
                var periodBegin = new Date(year, m - 1, d, hours, minutes, 0, 0);

                s = range[1].split("/");

                var d2, m2;
                d2 = ('0' + s[0]).slice(-2);
                m2 = ('0' + s[1]).slice(-2);
                var periodEnd = new Date(year, m2 - 1, d2, hours, minutes, 0, 0);

                //console.log(periodBegin + "\n" + periodEnd);

                while (periodBegin.getTime() <= periodEnd.getTime()) {
                    var dur = duration.getNums();
                    ////console.log(dur[0]);
                    var endTime = new Date(periodBegin.getTime() + dur[0] * 60 * 60 * 1000);

                    var description = campus + " " + desc;

                    //console.log(title + description + finalLoc);
                    calEntry.addEvent(title, description, finalLoc, periodBegin.toUTCString(), endTime.toUTCString());
                    periodBegin = new Date(periodBegin.getFullYear(), periodBegin.getMonth(), periodBegin.getDate() + 7, periodBegin.getHours(), periodBegin.getMinutes(), 0, 0);
                }
            }
            else {
                s = lessionDates[q].split("/");
                d2 = ('0' + s[0]).slice(-2);
                m2 = ('0' + s[1]).slice(-2);

                var tData = time.split(":");

                hours = tData[0];
                minutes = tData[1];
                periodBegin = new Date(year, m2 - 1, d2, hours, minutes, 0, 0);

                var dur = duration.getNums();
                ////console.log(dur[0]);
                var endTime = new Date(periodBegin.getTime() + dur[0] * 60 * 60 * 1000);

                var description = campus + " " + desc;

                //console.log(title + description + finalLoc);
                calEntry.addEvent(title, description, finalLoc, periodBegin.toUTCString(), endTime.toUTCString());

            }

        }
    }
    return calEntry.download('MonashTT', 'ics', what);
}

String.prototype.getNums = function () {
    var rx = /[+-]?((\.\d+)|(\d+(\.\d+)?)([eE][+-]?\d+)?)/g,
        mapN = this.match(rx) || [];
    return mapN.map(Number);
};

