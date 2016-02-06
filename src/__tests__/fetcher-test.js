import './auto-mock-off';
import Fetcher from '../fetcher';

describe('fetcher', function() {

  it('should login fetcher', function(done) {
    let fetcher = new Fetcher('s144448', '***REMOVED***');
    fetcher.login()
      .then(function(content) {
        // expect(content).toBe('...');
        return fetcher.getCourses();
      })
      .then(function(courses) {
        expect(courses).toBe('...');
        done();        
      });
  });
});
