Array.prototype.sortBy = function(callback) {
  this.sort((a, b) => {
    return callback(a) < callback(b) ? -1 : 0;
  });
};

Array.prototype.trueSort = function(callback) {
  this.sort((a, b) => {
    return callback(a, b) ? -1 : 0;
  });
};

String.prototype.capitalize = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};


String.prototype.singularize = function(number) {
  if (number !== undefined && number !== 1) {
    return this;
  }
  return {
    cemeteries: 'cemetery',
    Cemeteries: 'Cemetery',
  }[this] || this.slice(0, this.length - 1);
};

String.prototype.pluralize = function(number) {
  if (number === 1) {
    return this;
  }
  return {
    cemetery: 'cemeteries',
    Cemetery: 'Cemeteries',
    child: 'children',
    Child: 'Children',
  }[this] || this + 's';
};
