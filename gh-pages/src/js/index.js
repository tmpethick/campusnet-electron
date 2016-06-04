import "babel-polyfill";
import reqwest from 'reqwest';

const DOWNLOAD_URL = 'https://github.com/tmpethick/campusnet-electron/releases/latest';

/**
 * Replace link to github release page with link to platform 
 * specific installer if any is available for the given platform.
 */
reqwest({
  url: 'https://api.github.com/repos/tmpethick/campusnet-electron/releases/latest',
  type: 'jsonp',
  success: resp => {
    const release = resp.data;
    const version = getPlatformLink(release);
    if (version) {
      Array.prototype.forEach.call(
        document.querySelectorAll('.js-download'),
        $el => $el.setAttribute('href', version.link)
      );
      const $notice = document.querySelector('.js-download-notice');
      $notice.innerText = `${version.platform} detected. `;
      $notice.appendChild(createLinkElement('Different platform?', DOWNLOAD_URL));
    }
  }
});

const getPlatformLink = (release) => {
  if (isMac()) {
    const asset = release.assets.find(a => a.browser_download_url.endsWith('.dmg'));
    return {
        platform: 'Mac OS X',
        link: asset.browser_download_url
      };
  } else if (isWin64()) {
    // Use 32-bit version for now since auto update doesn't support both.
    // const asset = release.assets.find(a => {
    //   return a.browser_download_url.endsWith('.exe')
    //       && !a.browser_download_url.endsWith('ia32.exe');
    // });
    const asset = release.assets.find(a => a.browser_download_url.endsWith('ia32.exe'));
    return {
      platform: 'Windows 64-bit',
      link: asset.browser_download_url
    };    
  } else if (isWin32()) {
    const asset = release.assets.find(a => a.browser_download_url.endsWith('ia32.exe'));
    return {
      platform: 'Windows 32-bit',
      link: asset.browser_download_url
    };
  }else {
    return null;
  }
};

const isMac = () => navigator.appVersion.indexOf("Mac")!=-1;
const isWin64 = () => navigator.userAgent.indexOf("WOW64") != -1 || 
                      navigator.userAgent.indexOf("Win64") != -1;
const isWin32 = () => navigator.platform.indexOf('Win') != -1;

const createLinkElement = (text, href) => {
  const $a = document.createElement("a");
  const $linkText = document.createTextNode(text);
  $a.appendChild($linkText);
  $a.title = text;
  $a.href = href;
  return $a;
}

window.onload = function(){
  document.body.className += " loaded";
}
