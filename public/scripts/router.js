  'use strict';

  class Router {

      constructor() {
          this._routes = [];
      }

      on(route, callback) {

          const routeObj = {
              route,
              callback
          };

          this._routes.push(routeObj);
          return this;
      }

      navigate() {
          let params;
          const len = this._routes.length;
          for (let i = 0; i < len; i += 1) {
              const params = this.matchUrl(this._routes[i].route);

              if (params) {
                  const context = {
                      params: params,
                      redirect: this.redirect
                  };

                  this._routes[i].callback(context);
                  break;
              }
          }
      }

      matchUrl(targetUrl) {
          const actualUrl = location.hash;

          return this.areUrlsMatching(targetUrl, actualUrl);
      }

      areUrlsMatching(targetUrl, actualUrl) {
          const targetUrlParts = targetUrl.split('/');
          const actualUrlParts = actualUrl.split('/');

          if (targetUrlParts.length !== actualUrlParts.length) {
              return false;
          }

          const len = targetUrlParts.length;
          const params = {};
          for (let i = 0; i < len; i += 1) {
              if (actualUrlParts[i].indexOf('?') >= 0) {
                  const queryParams = this._getQueryParams(targetUrlParts[i], actualUrlParts[i]);

                  if (!queryParams) {
                      false;
                  }

                  params["queryParams"] = queryParams;

              } else if (targetUrlParts[i].indexOf(':') < 0) {

                  if (targetUrlParts[i] !== actualUrlParts[i]) {
                      return false;
                  }
              } else {

                  const currentParam = actualUrlParts[i];
                  const paramName = targetUrlParts[i].substring(1);

                  params[paramName] = currentParam;
              }
          }

          return params;
      }

      redirect(newHash) {
          location.hash = newHash;
      }

      _getQueryParams(targetUrl, actualUrl) {

          const actualUrlParts = actualUrl.split(/\?|&/g);

          if (targetUrl !== actualUrlParts[0]) {
              return false;
          }

          const queryParams = {};

          const len = actualUrlParts.length;
          for (let i = 1; i < len; i += 1) {
              const paramParts = actualUrlParts[i].split('=');

              const paramName = paramParts[0];
              const paramValue = paramParts[1];

              queryParams[paramName] = paramValue;
          }

          return queryParams;
      }

      run(initialHash) {

          const that = this;
          $(window).on('hashchange', function() {
              that.navigate();
          });

          $(() => {
              location.hash = initialHash;
              that.navigate();
          });
      }
  }

  export { Router };