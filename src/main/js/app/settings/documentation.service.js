'use strict';

angular
  .module('docs.settings')
  .factory('documentationService', function($q, $rootScope, DOCS, httpClient, _) {
    return {
      version: {
        save: saveVersion,
        uploadFile: uploadVersionFile,
        remove: removeVersion,
        moveUp: _.partial(moveVersion, 'up'),
        moveDown: _.partial(moveVersion, 'down'),
        listRewriteRules: function(documentationId, versionId) {
          return httpClient.get('/manage/documentations/' + documentationId + '/versions/' + versionId + '/rules');
        },
        updateRewriteRules: updateVersionUrlRewriteRules
      },
      documentation: {
        list: _.partial(httpClient.get, '/manage/documentations'),
        save: saveDocumentation,
        remove: removeDocumentation
      }
    };

    function addIdIfPresent(url, id) {
      return id
        ? url + '/' + id
        : url;
    }

    function moveVersion(direction, documentationId, versionId) {
      return httpClient
        .put(_.fmt('/manage/documentations/%s/versions/%s/move-%s', documentationId, versionId, direction))
        .then(emitDocumentationChangeEvent);
    }

    function emitDocumentationChangeEvent(response) {
      $rootScope.$emit(DOCS.onDocumentationUpdate);
      return response;
    }

    function updateVersionUrlRewriteRules(documentationId, versionId, rules) {
      return httpClient
        .post('/manage/documentations/' + documentationId + '/versions/' + versionId + '/rules', rules)
        .then(emitDocumentationChangeEvent);
    }

    function removeVersion(docId, versionId) {
      return httpClient
        .delete('/manage/documentations/' + docId + '/versions/' + versionId)
        .then(emitDocumentationChangeEvent);
    }

    function removeDocumentation(docId) {
        return httpClient
          .delete('/manage/documentations/' + docId)
          .then(emitDocumentationChangeEvent);
    }

    function saveDocumentation(documentationId, documentation) {
      return httpClient
        .post(addIdIfPresent('/manage/documentations', documentationId), documentation)
        .then(emitDocumentationChangeEvent);
    }

    function saveVersion(docId, version) {
      return httpClient
        .post(
          addIdIfPresent('/manage/documentations/' + docId + '/versions', version.id),
          _.omit(version, 'files'))
        .then(emitDocumentationChangeEvent);
    }

    function uploadVersionFile(docId, versionId, file) {
      return httpClient
        .uploadFile(
          '/manage/documentations/' + docId + '/versions/' + versionId + '/file',
          { file: file })
        .then(emitDocumentationChangeEvent);
    }
  });
