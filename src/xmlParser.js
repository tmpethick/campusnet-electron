import jsdom from 'jsdom';

export const xmlParser = function(options) {
  return new Promise(function (resolve, reject) {
    jsdom.env(Object.assign({}, options, {
      parsingMode: 'xml',
      done: (err, window) => {
        if (err) return reject(err);
        else resolve(window);
      }
    }));
  });
} 