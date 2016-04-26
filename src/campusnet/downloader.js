import fs from 'fs';
import osPath from 'path';
import sanitizeFilename from 'sanitize-filename';
import CampusNetClient from './campusnet-client';
import Promise from 'bluebird';

/**
 * requires `client` to be authenticated.
 * Returns promise which resolves when all elements files have been downloaded.
 * @param  {CampusNetClient} client 
 * @return {[type]}        [description]
 */
export const download = function(client, rootPath) {
  return Promise.map(client.getElements(), element => {
    return client.getElementFiles(element.id)
      .then(fileGenerator => {
        return Promise.map(fileGenerator, file => {
          return downloadFile(client, rootPath, element, file);
        });
      });
  });
};

export const downloadFile = function(
  client, rootPath, 
  element={id, name}, 
  file={id, path, modifiedDate}) 
{
  // TODO. append element path
  const topFolder = sanitizeFilename(element.name);
  let path = file.path.map(part => sanitizeFilename(part)).join('/');
  path = osPath.join(rootPath, topFolder, path);

  return newestVersionExists(path, file.modifiedDate)
    .then(newestExists => {
      if (!newestExists) {
        return client.downloadFile(element.id, file.id, path);
      }
      return Promise.resolve();
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

