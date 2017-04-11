const a11y = require('a11y');
const fs = require('fs');

a11y('lmo.com', function (err, reports) {
    //var output = JSON.parse(reports);
    var audit = reports.audit; // a11y Formatted report
    var report = reports.report; // DevTools Accessibility Audit formatted report

    fs.writeFile('../reports/audit.json', JSON.stringify(audit), function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('Audit Saved');
          }
      });
    fs.writeFile('../reports/report.txt', report, function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log('report saved');
          }
      });

});