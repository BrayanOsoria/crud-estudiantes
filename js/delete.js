
(function () {
  'use strict';

  var tbody = document.getElementById('students-body');
  var dialog = document.getElementById('confirm-dialog');
  var text = document.getElementById('confirm-text');
  var btnAccept = document.getElementById('confirm-accept');
  var btnCancel = document.getElementById('confirm-cancel');
  if (!tbody || !dialog) { return; }

  var pendingId = null;
  var supportsDialog = typeof dialog.showModal === 'function';

  function removeStudent(id) {
    var student = App.Storage.getById(id);
    var name = student ? student.nombre : 'el estudiante';

    if (App.Storage.remove(id)) {
      document.dispatchEvent(new CustomEvent('student:deleted', { detail: { id: id } }));
      App.showMessage('Estudiante "' + name + '" eliminado correctamente.');
    } else {
      App.showMessage('No se pudo eliminar el registro.', 'error');
    }
  }

  function askConfirmation(student) {
    var message = '¿Seguro que deseas eliminar a "' + student.nombre + '"? Esta acción no se puede deshacer.';

    if (!supportsDialog) {
      if (window.confirm(message)) { removeStudent(student.id); }
      return;
    }

    pendingId = student.id;
    text.textContent = message;
    dialog.showModal();
  }

  tbody.addEventListener('click', function (event) {
    var button = event.target.closest('[data-action="delete"]');
    if (!button) { return; }

    var student = App.Storage.getById(button.getAttribute('data-id'));
    if (!student) {
      App.showMessage('El registro ya no existe.', 'error');
      return;
    }
    askConfirmation(student);
  });

  btnAccept.addEventListener('click', function () {
    var id = pendingId;
    dialog.close();
    if (id) { removeStudent(id); }
  });

  btnCancel.addEventListener('click', function () {
    dialog.close();
  });

  dialog.addEventListener('close', function () {
    pendingId = null;
  });
})();