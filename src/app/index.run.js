(function() {
  'use strict';

  angular
    .module('macrofy')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
