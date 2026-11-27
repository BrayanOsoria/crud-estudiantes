
window.App = window.App || {};

(function () {
  'use strict';

  var STORAGE_KEY = 'crud_estudiantes_v1';

  function readAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('No se pudo leer localStorage, se usará una lista vacía.', error);
      return [];
    }
  }

  function writeAll(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (error) {
      console.warn('No se pudo escribir en localStorage.', error);
      return false;
    }
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function notifyChange() {
    document.dispatchEvent(new CustomEvent('students:changed'));
  }

  App.Storage = {
    KEY: STORAGE_KEY,

    getAll: function () {
      return readAll();
    },

    getById: function (id) {
      return readAll().find(function (s) { return s.id === id; }) || null;
    },

    create: function (data) {
      var list = readAll();
      var record = Object.assign({}, data, {
        id: generateId(),
        creadoEn: new Date().toISOString()
      });
      list.push(record);
      if (!writeAll(list)) { return null; }
      notifyChange();
      return record;
    },

    update: function (id, data) {
      var list = readAll();
      var index = list.findIndex(function (s) { return s.id === id; });
      if (index === -1) { return null; }
      list[index] = Object.assign({}, list[index], data, {
        id: list[index].id,
        actualizadoEn: new Date().toISOString()
      });
      if (!writeAll(list)) { return null; }
      notifyChange();
      return list[index];
    },

    remove: function (id) {
      var list = readAll();
      var next = list.filter(function (s) { return s.id !== id; });
      if (next.length === list.length) { return false; }
      if (!writeAll(next)) { return false; }
      notifyChange();
      return true;
    }
  };

  App.showMessage = function (text, type) {
    var box = document.getElementById('alerts');
    if (!box) { return; }
    var kind = type || 'success';
    var el = document.createElement('div');
    el.className = 'alert alert-' + kind;
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.textContent = text;
    box.appendChild(el);
    while (box.children.length > 3) { box.removeChild(box.firstChild); }
    setTimeout(function () { if (el.parentNode) { el.parentNode.removeChild(el); } }, 4000);
  };

  App.escapeHtml = function (value) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return map[c]; });
  };

  App.getFormData = function (form) {
    return {
      nombre: form.elements.nombre.value.trim().replace(/\s+/g, ' '),
      matricula: form.elements.matricula.value.trim(),
      correo: form.elements.correo.value.trim(),
      telefono: form.elements.telefono.value.trim(),
      carrera: form.elements.carrera.value
    };
  };

  App.setFieldError = function (form, name, message) {
    var input = form.elements[name];
    var out = form.querySelector('[data-error-for="' + name + '"]');
    if (out) { out.textContent = message || ''; }
    if (input) {
      if (message) {
        input.classList.add('invalid');
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
      }
    }
  };

  App.clearFieldErrors = function (form) {
    form.querySelectorAll('[data-error-for]').forEach(function (el) {
      App.setFieldError(form, el.getAttribute('data-error-for'), '');
    });
  };

  App.showFieldErrors = function (form, errors) {
    App.clearFieldErrors(form);
    var keys = Object.keys(errors);
    keys.forEach(function (name) { App.setFieldError(form, name, errors[name]); });
    if (keys.length > 0 && form.elements[keys[0]]) { form.elements[keys[0]].focus(); }
  };

  App.validate = function (data) {
    var errors = {};
    ['nombre', 'matricula', 'correo', 'carrera'].forEach(function (field) {
      if (!data[field]) { errors[field] = 'Este campo es obligatorio.'; }
    });
    return errors;
  };
})();