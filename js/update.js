
(function () {
  'use strict';

  var form = document.getElementById('student-form');
  var tbody = document.getElementById('students-body');
  var idInput = document.getElementById('student-id');
  var title = document.getElementById('form-title');
  var btnSubmit = document.getElementById('btn-submit');
  var btnCancel = document.getElementById('btn-cancel');
  if (!form || !tbody || !idInput) { return; }

  function enterEditMode(student) {
    App.clearFieldErrors(form);
    form.dataset.mode = 'edit';
    idInput.value = student.id;
    form.elements.nombre.value = student.nombre || '';
    form.elements.matricula.value = student.matricula || '';
    form.elements.correo.value = student.correo || '';
    form.elements.telefono.value = student.telefono || '';
    form.elements.carrera.value = student.carrera || '';

    title.textContent = 'Editar estudiante';
    btnSubmit.textContent = 'Actualizar';
    btnCancel.classList.remove('hidden');

    title.scrollIntoView({ behavior: 'smooth', block: 'start' });
    form.elements.nombre.focus();
  }

  function exitEditMode() {
    form.reset();
    form.dataset.mode = 'create';
    idInput.value = '';
    title.textContent = 'Registrar estudiante';
    btnSubmit.textContent = 'Guardar';
    btnCancel.classList.add('hidden');
    App.clearFieldErrors(form);
  }

  tbody.addEventListener('click', function (event) {
    var button = event.target.closest('[data-action="edit"]');
    if (!button) { return; }

    var student = App.Storage.getById(button.getAttribute('data-id'));
    if (!student) {
      App.showMessage('El registro ya no existe.', 'error');
      return;
    }
    enterEditMode(student);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (event.handled || form.dataset.mode !== 'edit') { return; }
    event.handled = true;

    var id = idInput.value;
    var data = App.getFormData(form);
    var errors = App.validate(data, id);

    if (Object.keys(errors).length > 0) {
      App.showFieldErrors(form, errors);
      App.showMessage('Revisa los campos marcados en rojo.', 'error');
      return;
    }

    var updated = App.Storage.update(id, data);
    if (!updated) {
      App.showMessage('No se pudo actualizar: el registro no existe o no se pudo guardar.', 'error');
      exitEditMode();
      return;
    }

    App.showMessage('Estudiante "' + updated.nombre + '" actualizado correctamente.');
    exitEditMode();
  });

  btnCancel.addEventListener('click', function () {
    exitEditMode();
    App.showMessage('Edición cancelada.', 'info');
  });

  document.addEventListener('student:deleted', function (event) {
    if (event.detail && idInput.value === event.detail.id) { exitEditMode(); }
  });
})();