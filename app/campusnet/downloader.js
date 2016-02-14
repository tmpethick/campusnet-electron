import fs from 'fs';
import osPath from 'path';
import sanitizeFilename from 'sanitize-filename';
import CampusNetClient from './campusnet-client';

/**
 * requires `client` to be authenticated.
 * Returns promise which resolves when all elements files have been downloaded.
 * @param  {CampusNetClient} client 
 * @return {[type]}        [description]
 */
export const download = function(client) {
  return client.getElements()
    .then(elements => {
      return Promise.all(
        elements.map(element => {
          return client
            .getElementFiles(element.id)
            .then(fileGenerator => {
              let promises = [];
              for (let file of fileGenerator) {
                promises.push(downloadFile(client, element, file));
              }
              return Promise.all(promises);
            });
        })
      );
    });

};

export const downloadFile = function(client, element={id, name}, file={id, path, modifiedDate}) {
  // TODO. append element path
  const topFolder = sanitizeFilename(element.name);
  let path = file.path.map(part => sanitizeFilename(part)).join('/');
  path = osPath.join(__dirname, 'downloads', topFolder, path);

  return newestVersionExists(path, file.modifiedDate)
    .then(newestExists => {
      if (!newestExists) {
        console.log("have to download")
        return client.downloadFile(element.id, file.id, path);
      }
      return;
    });
}

/**
 * check if newest version exists. Calls resolve with `true`.
 */
export const newestVersionExists = function(path, newCreationDate) {
  return new Promise((resolve, reject) => {
    fs.lstat(path, (err, stats) => {
      if (err) 
        resolve(false);
      else 
        resolve(stats.isFile() && stats.birthtime >= newCreationDate);
    });

  });
}

