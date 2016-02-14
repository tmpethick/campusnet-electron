import cheerio from 'cheerio';
import Immutable from 'immutable';

export const xmlParser = function(content) {
  return cheerio.load(content, {
    xmlMode: true,
    normalizeWhitespace: true
  });
} 

export const getFilesFromXML = function* ($) {
  // traverse from the top element
  yield *traverse($.root().children().first().get(0).childNodes);
}

const traverse = function* (elements, path=Immutable.List()) {
  
  for (let element of elements) {
    // Ignore text nodes
    if (!element.attribs) continue;
    
    const newPath = path.push(element.attribs['Name']);
    if (element.tagName === 'File') {
      // TODO: creation date
      yield {
        path: newPath,
        id: element.attribs['Id'],
        modifiedDate: getModifiedDate(element)
      };
    }

    yield *traverse(element.childNodes, newPath);
  }
}

export const getModifiedDate = function(element) {
  let highestVersionNumber = 0;
  let date = 0;
  cheerio(element).children().each((i, element) => {
    let $el = cheerio(element);
    let version = parseInt($el.attr('Version'), 10);
    if (version > highestVersionNumber) {
      highestVersionNumber = version;
      date = $el.attr('Created');
    } 
  })
  return new Date(date);
}