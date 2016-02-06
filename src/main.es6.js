
import Fetcher from './fetcher';

let fetcher = new Fetcher('s144448', 'wBA49deM');
    fetcher.login()
      .then(function(content) {
        // expect(content).toBe('...');
        return fetcher.getCourses();
      })
      .then(function(courses) {
        console.log(courses);
      });