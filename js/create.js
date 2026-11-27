
(function () {
  'use strict';

  var form = document.getElementById('student-form');
  if (!form) { return; }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    
    if (event.handled || form.dataset.mode === 'edit') { return; }
    event.handled = true;

    var data = App.getFormData(form);
    var errors = App.validate(data, null);

    if (Object.keys(errors).length > 0) {
      App.showFieldErrors(form, errors);
      App.showMessage('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    var record = App.Storage.create(data);
    if (!record) {
      App.showMessage('No se pudo guardar el registro en el navegador.', 'error');
      return;
    }

    form.reset();
    App.clearFieldErrors(form);
    App.showMessage('Estudiante "' + record.nombre + '" registrado correctamente.');
    form.elements.nombre.focus();
  });
})();