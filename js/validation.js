
(function () {
  'use strict';

  var form = document.getElementById('student-form');
  var idInput = document.getElementById('student-id');
  if (!form || !idInput) { return; }

  var PATTERNS = {
    nombre: /^\p{L}[\p{L}' .-]{2,59}$/u,
    matricula: /^\d{4}-\d{4}$/,
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    telefono: /^\d{3}-\d{3}-\d{4}$/
  };

  var FIELDS = ['nombre', 'matricula', 'correo', 'telefono', 'carrera'];

  function same(a, b) {
    return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
  }

  App.validate = function (data, currentId) {
    var errors = {};
    var others = App.Storage.getAll().filter(function (s) { return s.id !== currentId; });

    if (!data.nombre) {
      errors.nombre = 'El nombre es obligatorio.';
    } else if (data.nombre.length < 3) {
      errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!PATTERNS.nombre.test(data.nombre)) {
      errors.nombre = 'Solo se permiten letras, espacios, apóstrofes, puntos y guiones.';
    }

    if (!data.matricula) {
      errors.matricula = 'La matrícula es obligatoria.';
    } else if (!PATTERNS.matricula.test(data.matricula)) {
      errors.matricula = 'Formato inválido. Usa AAAA-NNNN (ej: 2024-0001).';
    } else if (others.some(function (s) { return same(s.matricula, data.matricula); })) {
      errors.matricula = 'Ya existe un estudiante con esa matrícula.';
    }

    if (!data.correo) {
      errors.correo = 'El correo es obligatorio.';
    } else if (!PATTERNS.correo.test(data.correo)) {
      errors.correo = 'Ingresa un correo válido (ej: nombre@dominio.com).';
    } else if (others.some(function (s) { return same(s.correo, data.correo); })) {
      errors.correo = 'Ya existe un estudiante con ese correo.';
    }

    if (data.telefono && !PATTERNS.telefono.test(data.telefono)) {
      errors.telefono = 'Formato inválido. Usa 809-555-1234.';
    }

    if (!data.carrera) {
      errors.carrera = 'Selecciona una carrera.';
    }

    return errors;
  };

  function formatMatricula(value) {
    var d = value.replace(/\D/g, '').slice(0, 8);
    return d.length > 4 ? d.slice(0, 4) + '-' + d.slice(4) : d;
  }

  function formatTelefono(value) {
    var d = value.replace(/\D/g, '').slice(0, 10);
    if (d.length > 6) { return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6); }
    if (d.length > 3) { return d.slice(0, 3) + '-' + d.slice(3); }
    return d;
  }

  form.elements.matricula.addEventListener('input', function () {
    this.value = formatMatricula(this.value);
  });

  form.elements.telefono.addEventListener('input', function () {
    this.value = formatTelefono(this.value);
  });

  function validateField(name) {
    var errors = App.validate(App.getFormData(form), idInput.value);
    App.setFieldError(form, name, errors[name] || '');
  }

  FIELDS.forEach(function (name) {
    var input = form.elements[name];
    if (!input) { return; }

    var eventName = input.tagName === 'SELECT' ? 'change' : 'blur';
    input.addEventListener(eventName, function () { validateField(name); });

    input.addEventListener('input', function () {
      if (input.classList.contains('invalid')) { validateField(name); }
    });
  });
})();