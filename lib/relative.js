(function() {
  var root = this;
  var oldRef = root.relative;

  // Testing if Date now for retrocompatibiliy with older browsers
  if (!Date.now) {
    Date.now = function now() {
      return new Date().getTime();
    };
  }

  var relative = function(toDate, fromDate){
    var unitMs = {
      'Seconds' : 1e3,
      'Minutes' : 6e4,
      'Hours' : 36e5,
      'Days' : 864e5,
      'Months' : 2678400000
    },
    strings = {
      ago : "%s ago",
      future: "%s from now",
      now : "just now",
      m : "%d minute",
      mm : "%d minutes",
      h : "%d hour",
      hh : "%d hours",
      d : "%d day",
      dd : "%d days",
      M : "%d month",
      MM : "%d months"
    };
    var result = '';

    // Helpers
    function leadingZero(number) {
      return ('0' + number).slice(-2);
    }
    function numberAgo (number,ms){
      return Math.round(number/ms);
    }
    function formatDate(date){
      // MM/DD/YYYY
      return [leadingZero(date.getMonth()+1), leadingZero(date.getDate()), date.getFullYear()].join('/');
    }

    if (toDate instanceof Date === false) {
      toDate = new Date(toDate);
      // toDate is a date
      if (isNaN(toDate.getTime())) {
        // toDate is an invalid date format
        return;
      }
    }

    if (toDate instanceof Date){
      fromDate = (fromDate !== undefined && fromDate instanceof Date) ? fromDate.getTime() : new Date();

      var difference = Math.abs(toDate.getTime() - fromDate.getTime());
      var wording = (toDate.getTime() < fromDate.getTime()) ? strings.ago : strings.future;

      if (difference > unitMs.Months){
        result = formatDate(toDate);
      }
      else {
        if (difference < unitMs.Minutes){
          result = strings.now;
        }
        else {
          var unit = '';
          var time = 0;

          if (difference < unitMs.Hours){
            time = numberAgo(difference,unitMs.Minutes);
            unit = 'm';
          }
          else if (difference < unitMs.Days){
            time = numberAgo(difference,unitMs.Hours);
            unit = 'h';
          }
          else if (difference < unitMs.Months){
            time = numberAgo(difference,unitMs.Days);
            unit = 'd';
          }
          else {
            time = numberAgo(difference,unitMs.Months);
            unit = 'M';
          }

          unit = time === 1 ? unit : unit + unit;
          result = wording.replace(/%s/i,strings[unit]);
          result = result.replace(/%d/i,time);
        }
      }
    }

    return result;
  };

  relative.noConflict = function() {
    root.relative = oldRef;
    return relative;
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = relative;
    }
    exports.relative = relative;
  } else {
    root.relative = relative;
  }

}());
