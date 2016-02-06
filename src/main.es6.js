
import Fetcher from './fetcher';

let fetcher = new Fetcher('s144448', '***REMOVED***');
    fetcher.login()
      .then(function(content) {
        // expect(content).toBe('...');
        return fetcher.getCourses();
      })
      .then(function(courses) {
        console.log(courses);
      });