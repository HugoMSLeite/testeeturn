'use strict';

angular.module('TesteEturn', ['LocalForageModule','ui.utils.masks','ui.utils.masks.br'])
    .config(function($localForageProvider) {
        // configure provider localForage
        $localForageProvider.config({
            name: 'testeeturn',
            description: 'storage for '
        });
    })