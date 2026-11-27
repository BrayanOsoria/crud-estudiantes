
(function () {
  'use strict';

  var tbody = document.getElementById('students-body');
  var counter = document.getElementById('count');
  var search = document.getElementById('search');
  if (!tbody) { return; }

  function matches(student, term) {
    var text = [student.nombre, student.matricula, student.correo, student.telefono, student.carrera]
      .join(' ')
      .toLowerCase();
    return text.indexOf(term) !== -1;
  }

  function render() {
    var term = search ? search.value.trim().toLowerCase() : '';
    var all = App.Storage.getAll();
    var list = term ? all.filter(function (s) { return matches(s, term); }) : all;

    if (counter) {
      counter.textContent = all.length + (all.length === 1 ? ' estudiante' : ' estudiantes');
    }

    if (list.length === 0) {
      var message = all.length === 0
        ? 'Aún no hay estudiantes registrados.'
        : 'Ningún estudiante coincide con la búsqueda.';
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">' + message + '</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function (s, index) {
      var e = App.escapeHtml;
      return '<tr>' +
        '<td>' + (index + 1) + '</td>' +
        '<td>' + e(s.nombre) + '</td>' +
        '<td>' + e(s.matricula) + '</td>' +
        '<td>' + e(s.correo) + '</td>' +
        '<td>' + (s.telefono ? e(s.telefono) : '—') + '</td>' +
        '<td>' + e(s.carrera) + '</td>' +
        '<td><div class="actions">' +
          '<button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-id="' + e(s.id) + '">Editar</button>' +
          '<button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="' + e(s.id) + '">Eliminar</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
  }

  document.addEventListener('students:changed', render);
  if (search) { search.addEventListener('input', render); }

  window.addEventListener('storage', function (event) {
    if (event.key === App.Storage.KEY) { render(); }
  });

  render();
})();