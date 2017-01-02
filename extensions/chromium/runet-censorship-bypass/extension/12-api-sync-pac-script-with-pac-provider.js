'use strict';

/*
  Task 1. Gets IPs for proxies of antizapret/anticenz via dns over https.
          These IPs are used in block-informer to inform user when proxy is ON.
  Task 2. Downloads PAC proxy script from antizapret/anticenz/
          my Google Drive and sets it in Chromium settings.
  Task 3. Schedules tasks 1 & 2 for every 4 hours.
*/

/*
  In background scripts use window.apis.antiCensorRu public variables.
  In pages window.apis.antiCensorRu is not accessible,
    use chrome.runtime.getBackgroundPage(..),
    extension.getBackgroundPage is deprecated

  If you want to catch errors, then call api from setTimeout!
  See errorHandlers api for more.

*/

{ // Private namespace starts.

  function mandatory() {

    throw new TypeError('Missing required argument. ' +
      'Be explicit if you swallow errors.');

  }

  function throwIfError(err) {

    if(err) {
      throw err;
    }

  }

  function asyncLogGroup(...args) {

    const cb = args.pop();
    if(!(cb && typeof(cb) === 'function')) {
      throw new TypeError('cb must be a function, but got: ' + cb);
    }
    console.group(...args);
    return function(...cbArgs) {

      console.groupEnd();
      console.log('Group finished.');
      cb(...cbArgs);

    };

  }

  function checkChromeError(betterStack) {

    // Chrome API calls your cb in a context different from the point of API
    // method invokation.
    const err = chrome.runtime.lastError || chrome.extension.lastError || null;
    if (err) {
      const args = ['API returned error:', err];
      if (betterStack) {
        args.push('\n' + betterStack);
      }
      console.warn(...args);
    }
    return err;

  }

  function chromified(cb = mandatory(), ...replaceArgs) {

    const stack = (new Error()).stack;
    // Take error first callback and convert it to chrome api callback.
    return function(...args) {

      if (replaceArgs.length) {
        args = replaceArgs;
      }
      const err = checkChromeError(stack);
      // setTimeout fixes error context.
      setTimeout( cb.bind(null, err, ...args), 0 );

    };

  }

  window.apis.antiCensorRu = {

    version: chrome.runtime.getManifest().version,

    pacProviders: {
      Антизапрет: {
        pacUrls: ['https://antizapret.prostovpn.org/proxy.pac'],
        proxyHosts: ['proxy.antizapret.prostovpn.org'],
        proxyIps: {
          '195.123.209.38': 'proxy.antizapret.prostovpn.org',
          '137.74.171.91': 'proxy.antizapret.prostovpn.org',
          '51.15.39.201': 'proxy.antizapret.prostovpn.org',
          '2a02:27ac::10': 'proxy.antizapret.prostovpn.org',
          '2001:bc8:4700:2300::1:d07': 'proxy.antizapret.prostovpn.org',
        },
      },
      Антиценз: {
        pacUrls: ['https://config.anticenz.org/proxy.pac'],
        proxyHosts: ['gw2.anticenz.org'],
        proxyIps: {
          '5.196.220.114': 'gw2.anticenz.org',
        },
      },
      Оба_и_на_свитчах: {
        /*
          Don't use in system configs! Because Win does poor caching.
          Url is encoded to counter abuse.
          Version: 0.17
        */
        pacUrls: [
          // Cloud Flare
          '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x61\x6e\x74\x69\x63\x65\x6e\x73\x6f\x72\x73\x68\x69\x70\x2d\x72\x75\x73\x73\x69\x61\x2e\x74\x6b\x2f\x67\x65\x6e\x65\x72\x61\x74\x65\x64\x2d\x70\x61\x63\x2d\x73\x63\x72\x69\x70\x74\x73\x2f\x6f\x6e\x2d\x73\x77\x69\x74\x63\x68\x65\x73\x2d\x30\x2e\x31\x37\x2e\x70\x61\x63',
          // GitHub
          '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x72\x61\x77\x2e\x67\x69\x74\x68\x75\x62\x75\x73\x65\x72\x63\x6f\x6e\x74\x65\x6e\x74\x2e\x63\x6f\x6d\x2f\x61\x6e\x74\x69\x63\x65\x6e\x73\x6f\x72\x73\x68\x69\x70\x2d\x72\x75\x73\x73\x69\x61\x2f\x67\x65\x6e\x65\x72\x61\x74\x65\x64\x2d\x70\x61\x63\x2d\x73\x63\x72\x69\x70\x74\x73\x2f\x6d\x61\x73\x74\x65\x72\x2f\x6f\x6e\x2d\x73\x77\x69\x74\x63\x68\x65\x73\x2d\x30\x2e\x31\x37\x2e\x70\x61\x63',
          // Google Drive
          '\x68\x74\x74\x70\x73\x3a\x2f\x2f\x64\x72\x69\x76\x65\x2e\x67\x6f\x6f\x67\x6c\x65\x2e\x63\x6f\x6d\x2f\x75\x63\x3f\x65\x78\x70\x6f\x72\x74\x3d\x64\x6f\x77\x6e\x6c\x6f\x61\x64\x26\x69\x64\x3d\x30\x42\x2d\x5a\x43\x56\x53\x76\x75\x4e\x57\x66\x30\x54\x44\x46\x52\x4f\x47\x35\x46\x62\x55\x39\x4f\x64\x44\x67'],
        proxyHosts: ['proxy.antizapret.prostovpn.org', 'gw2.anticenz.org'],
        proxyIps: {
          '195.123.209.38': 'proxy.antizapret.prostovpn.org',
          '137.74.171.91': 'proxy.antizapret.prostovpn.org',
          '51.15.39.201': 'proxy.antizapret.prostovpn.org',
          '2a02:27ac::10': 'proxy.antizapret.prostovpn.org',
          '2001:bc8:4700:2300::1:d07': 'proxy.antizapret.prostovpn.org',
          '5.196.220.114': 'gw2.anticenz.org',
        },
      },
    },

    _currentPacProviderKey: 'Оба_и_на_свитчах',

    /* Is it the first time extension installed?
       Do something, e.g. initiate PAC sync.
    */
    ifFirstInstall: false,
    lastPacUpdateStamp: 0,

    _currentPacProviderLastModified: 0, // Not initialized.

    getLastModifiedForKey(key = mandatory()) {

      if (this._currentPacProviderKey === key) {
        return new Date(this._currentPacProviderLastModified).toUTCString();
      }
      return new Date(0).toUTCString();

    },
    setLastModified(newValue = mandatory()) {

      this._currentPacProviderLastModified = newValue;

    },

    isProxied(ip) {

      // Executed on each request with ip. Make it as fast as possible.
      // Property lookups are cheap (I tested).
      return this._currentPacProviderKey
        && this.pacProviders[this._currentPacProviderKey]
          .proxyIps.hasOwnProperty(ip);

    },

    mustBeKey(key = mandatory()) {

      if ( !(key === null || this.pacProviders[key]) ) {
        throw new TypeError('No provider for key:' + key);
      }

    },

    getCurrentPacProviderKey() {

      return this._currentPacProviderKey;

    },
    setCurrentPacProviderKey(newKey, lastModified = new Date().toUTCString()) {

      this.mustBeKey(newKey);
      this._currentPacProviderKey = newKey;
      this._currentPacProviderLastModified = lastModified;

    },

    getPacProvider(key) {

      if(key) {
        this.mustBeKey(key);
      } else {
        key = this.getCurrentPacProviderKey();
      }
      return this.pacProviders[key];

    },

    _periodicUpdateAlarmReason: 'Периодичное обновление PAC-скрипта Антизапрет',

    pushToStorageAsync(cb = throwIfError) {

      console.log('Pushing to storage...');

      // Copy only settable properties (except functions).
      const onlySettable = {};
      for(const key of Object.keys(this)) {
        if (
          Object.getOwnPropertyDescriptor(this, key).writable
            && typeof(this[key]) !== 'function'
        ) {
          onlySettable[key] = this[key];
        }
      }

      chrome.storage.local.clear(
        () => chrome.storage.local.set(
          onlySettable,
          chromified(cb, onlySettable)
        )
      );

    },

    syncWithPacProviderAsync(
      key = this.currentPacProvierKey, cb = throwIfError) {

      if( typeof(key) === 'function' ) {
        cb = key;
        key = this.getCurrentPacProviderKey();
      }
      cb = asyncLogGroup('Syncing with PAC provider ' + key + '...', cb);

      if (key === null) {
        // No pac provider set.
        return cb({
          clarification: {
            message: 'Сперва выберите PAC-провайдера.',
          },
        });
      }

      const pacProvider = this.getPacProvider(key);

      const pacSetPromise = new Promise(
        (resolve, reject) => setPacScriptFromProviderAsync(
          pacProvider,
          this.getLastModifiedForKey(key),
          (err, res) => {

            if (res && res.ifPacSet) {
              this.setCurrentPacProviderKey(key, res.lastModified);
              this.lastPacUpdateStamp = Date.now();
              this.ifFirstInstall = false;
              this.setAlarms();
            }

            resolve([err, res]);

          }
        )
      );

      const ipsPromise = new Promise(
        (resolve, reject) => updatePacProxyIps(
          pacProvider,
          (ipsError) => {

            if (ipsError && ipsError.clarification) {
              ipsError.clarification.ifNotCritical = true;
            }
            resolve([ipsError]);

          }
        )
      );

      Promise.all([pacSetPromise, ipsPromise]).then(
        ([[pacErr, pacRes], [ipsErr]]) => {

          if (pacErr && ipsErr) {
            return cb(pacErr, pacRes);
          }
          this.pushToStorageAsync(
            (pushErr) => cb(pacErr || ipsErr || pushErr, pacRes)
          );

        },
        cb
      );

    },

    _pacUpdatePeriodInMinutes: 12*60,
    get pacUpdatePeriodInMinutes() {

      return this._pacUpdatePeriodInMinutes;

    },

    setAlarms() {

      let nextUpdateMoment = this.lastPacUpdateStamp
        + this._pacUpdatePeriodInMinutes*60*1000;
      const now = Date.now();
      if (nextUpdateMoment < now) {
        nextUpdateMoment = now;
      }

      console.log(
        'Next PAC update is scheduled on',
        new Date(nextUpdateMoment).toLocaleString('ru-RU')
      );

      chrome.alarms.create(
        this._periodicUpdateAlarmReason,
        {
          when: nextUpdateMoment,
          periodInMinutes: this._pacUpdatePeriodInMinutes,
        }
      );

      // ifAlarmTriggered. May be changed in the future.
      return nextUpdateMoment === now;

    },

    installPacAsync(key, cb = throwIfError) {

      console.log('Installing PAC...');
      if (!key) {
        throw new Error('Key must be defined.');
      }
      if (this.currentProviderKey !== key) {
        return this.syncWithPacProviderAsync(key, cb);
      }
      console.log(key + ' already installed.');
      cb();

    },

    clearPacAsync(cb = throwIfError) {

      cb = asyncLogGroup('Cearing alarms and PAC...', cb);
      chrome.alarms.clearAll(
        () => chrome.proxy.settings.clear(
          {},
          () => {

            const err = checkChromeError();
            if (err) {
              return cb(err);
            }
            this.setCurrentPacProviderKey(null);
            this.pushToStorageAsync(cb);

          }
        )
      );

    },

  };

  // ON EACH LAUNCH, STARTUP, RELOAD, UPDATE, ENABLE
  chrome.storage.local.get(null, (oldStorage) => {

    const err = checkChromeError();
    if (err) {
      throw err;
    }

    /*
       Event handlers that ALWAYS work (even if installation is not done
       or failed).
       E.g. install window may fail to open or be closed by user accidentally.
       In such case extension _should_ try to work on default parameters.
    */
    const antiCensorRu = window.apis.antiCensorRu;

    chrome.alarms.onAlarm.addListener(
      (alarm) => {

        if (alarm.name === antiCensorRu._periodicUpdateAlarmReason) {
          console.log(
            'Periodic PAC update triggered:',
            new Date().toLocaleString('ru-RU')
          );
          antiCensorRu.syncWithPacProviderAsync(() => {/* swallow */});
        }

      }
    );
    console.log('Alarm listener installed. We won\'t miss any PAC update.');

    window.addEventListener('online', () => {

      console.log('We are online, checking periodic updates...');
      antiCensorRu.setAlarms();

    });

    console.log('Storage on init:', oldStorage);
    antiCensorRu.ifFirstInstall = Object.keys(oldStorage).length === 0;

    if (!antiCensorRu.ifFirstInstall) {
      // LAUNCH, RELOAD, UPDATE
      // Use old or migrate to default.
      antiCensorRu._currentPacProviderKey =
        oldStorage._currentPacProviderKey || null;
      antiCensorRu.lastPacUpdateStamp =
        oldStorage.lastPacUpdateStamp || antiCensorRu.lastPacUpdateStamp;
      antiCensorRu._currentPacProviderLastModified =
        oldStorage._currentPacProviderLastModified
        || antiCensorRu._currentPacProviderLastModified;
      console.log(
        'Last PAC update was on',
        new Date(antiCensorRu.lastPacUpdateStamp).toLocaleString('ru-RU')
      );
    } else {
      // INSTALL
      console.log('Installing...');
      return chrome.runtime.openOptionsPage();
    }

    if (!antiCensorRu.getPacProvider()) {
      /*
        In case of UPDATE:
          1. new providers will still be shown.
          2. new version won't be pushed to storage
      */
      return console.log('No PAC provider set. Do nothing.');
    }

    /*
      1. There is no way to check that chrome.runtime.onInstalled wasn't fired
         except timeout.
         Otherwise we could put storage migration code only there.
      2. We have to check storage for migration before using it.
         Better on each launch then on each pull.
    */

    const ifAlarmTriggered = antiCensorRu.setAlarms();

    if (antiCensorRu.version === oldStorage.version) {
      // LAUNCH, RELOAD, ENABLE
      antiCensorRu.pacProviders = oldStorage.pacProviders;
      return console.log('Extension launched, reloaded or enabled.');
    }

    // UPDATE & MIGRATION
    console.log('Extension updated.');
    if (!ifAlarmTriggered) {
      antiCensorRu.pushToStorageAsync();
    }

    /*
      History of Changes to Storage (Migration Guide)
      -----------------------------------------------
      Version 0.0.0.10
        * Added this.version
        * PacProvider.proxyIps changed from {ip -> Boolean} to {ip -> hostname}
      Version 0.0.0.8-9
        * Changed storage.ifNotInstalled to storage.ifFirstInstall
        * Added storage.lastPacUpdateStamp
    **/

  });

  /*
    * result.ifPacSet is true if PAC was set (maybe with non-critical errors).
    * */
  function setPacAsync(
    {pacData = mandatory(), pacUrl = mandatory()},
    cb = throwIfError
  ) {

    const config = {
      mode: 'pac_script',
      pacScript: {
        mandatory: false,
        data: pacData,
      },
    };
    console.log('Setting chrome proxy settings...');
    chrome.proxy.settings.set( {value: config}, async () => {

      let err = checkChromeError();
      let asciiErr;
      if (err) {
        if (err.message.startsWith('\'pacScript.data\' supports only ASCII')) {
          asciiErr = err;
          asciiErr.clarification = {ifNotCritical: true};
          err = await new Promise((resolve) => {

            chrome.proxy.settings.set({
              value: {
                  mode: 'pac_script',
                  pacScript: {
                    url: pacUrl,
                  },
                },
              },
              () => resolve( checkChromeError() )
            );

          });

        }
        if (err) {
          return cb(err);
        }
      }
      chrome.proxy.settings.get({}, (details) => {

        if ( window.utils.areSettingsNotControlledFor( details ) ) {
          console.warn('Failed, other extension is in control.');
          return cb({clarification: {
            message: window.utils.messages.whichExtensionHtml(),
          }});
        }
        console.log('Successfuly set PAC in proxy settings..');
        cb(asciiErr, {ifPacSet: true});
      });

    });

  }

  function clarifyFetchErrorThen(cb) {

    return (err) => {

      err.clarification = {
        message: 'Что-то не так с сетью, проверьте соединение.',
      };
      return cb(err);

    }

  }

  function ifModifiedSince(url, lastModified = mandatory(), cb = mandatory()) {

    fetch(url, {
      method: 'HEAD',
      headers: new Headers({
        'If-Modified-Since': lastModified
      })
    }).then(
      (res) => {
        console.log('HEAD', res);
        window.R = res;
        cb(null, res.status === 304 ? false : (res.headers.get('Last-Modified') || new Date(0).toUTCString()) );
      },
      clarifyFetchErrorThen(cb)
    );

  }

  function httpGet(url, cb = mandatory()) {

    const start = Date.now();
    fetch(url, {cache: 'no-store'}).then(
      (res) => {

        const textCb =
          (err) => res.text().then( (text) => cb(err, text), cb );
        const status = res.status;
        if ( !( status >= 200 && status < 300 || status === 304 ) ) {
          res.clarification = {
            message: 'Получен ответ с неудачным HTTP-кодом ' + status + '.',
          };
          return textCb(res);
        }
        console.log('GETed with success:', url, Date.now() - start);
        textCb();

      },
      clarifyFetchErrorThen(cb)
    );

  }

  function getIpsFor(host, cb = mandatory()) {

    const types = [1, 28];
    const promises = types.map(
      (type) => new Promise((resolve) =>
        httpGet(
          'https://dns.google.com/resolve?type=' + type + '&name=' + host,
          (err, res) => {

            if (res) {
              try {
                res = JSON.parse(res);
                console.log('Json parsed.');
                if (err || res.Status) {
                  const msg = ['Answer', 'Comment', 'Status']
                    .filter( (prop) => res[prop] )
                    .map( (prop) => prop + ': ' + JSON.stringify( res[prop] ) )
                    .join(', \n');
                  err.clarification.message += ' Сервер (json): ' + msg;
                  err.data = err.data || res;
                } else {
                  res = res.Answer || [];
                  res = res.filter(
                    (record) => types.includes(record.type)
                  );
                }
              } catch(e) {
                err = e || err || {clarification: {message: ''}};
                err.clarification = err.clarification || {message: ''};
                err.clarification.message = (
                  err.clarification.message
                  + ' Сервер (текст): '+ res
                ).trim();
                err.data = err.data || res;
              }
            }
            resolve([err, res]);

          }
        )
      )
    );
    Promise.all(promises).then(
      ([[v4err, v4res], [v6err, v6res]]) => {

        if(v4err) {
          return cb(v4err, v4res);
        }
        const ips = v4res;
        if (!v6err) {
          ips.push(...v6res);
        } else {
          v6err.clarification.ifNotCritical = true;
          console.warn(v6err);
        }
        cb(v6err, ips);

      }
    );

  }

  function updatePacProxyIps(provider, cb = throwIfError) {

    cb = asyncLogGroup(
      'Getting IP for '+ provider.proxyHosts.join(', ') + '...',
      cb
    );
    let failure = {
      clarification: {
        message: 'Не удалось получить один или несколько IP адресов для' +
        ' прокси-серверов. Иконка для уведомления об обходе блокировок ' +
        'может не отображаться.',
      },
      errors: {},
    };
    let i = 0;
    provider.proxyHosts.forEach(
      (proxyHost) => getIpsFor(
        proxyHost,
        (err, ips) => {

          if (!err || err.clarification.ifNotCritical) {
            provider.proxyIps = provider.proxyIps || {};
            ips.forEach(
              (ip) => provider.proxyIps[ip] = proxyHost
            );
          } else {
            failure.errors[proxyHost] = err;
          }

          if ( ++i === provider.proxyHosts.length ) {
            failure = Object.keys(failure.errors).length ? failure : null;
            cb(failure, provider.proxyIps);
          }
        }
      )
    );

  }

  /*
   * result.ifPacSet is true if PAC was set.
  **/
  function setPacScriptFromProviderAsync(provider = mandatory(), lastModified = mandatory(), cb = throwIfError) {

    const pacUrl = provider.pacUrls[0];
    cb = asyncLogGroup(
      'Getting PAC script from provider...', pacUrl,
      cb
    );

    ifModifiedSince(pacUrl, lastModified, (err, newLastModified) => {

      if (!newLastModified) {
        return cb(
          {clarification: {
            message: 'Ваш PAC-скрипт не нуждается в обновлении. Его дата: ' + lastModified,
            ifNotCritical: true,
          }}
        );
      }

      httpGet(
        pacUrl,
        (err, pacData) => {

          if (err) {
            err.clarification = {
              message: 'Не удалось скачать PAC-скрипт с адреса: '
                + provider.pacUrl + '.',
              prev: err.clarification,
            };
            return cb(err);
          }
          setPacAsync(
            {pacData, pacUrl},
            (err, res) => cb( err, Object.assign(res || {}, {lastModified: newLastModified}) )
          );

        }
      );
    })

  }

}