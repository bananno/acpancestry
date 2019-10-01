Array.prototype.sortBy = function(callback) {
  return this.sort((a, b) => {
    return callback(a) < callback(b) ? -1 : 0;
  });
};

Array.prototype.trueSort = function(callback) {
  return this.sort((a, b) => {
    return callback(a, b) ? -1 : 0;
  });
};

Array.prototype.random = function() {
  let n = Math.round(Math.random() * (this.length - 1));
  return this[n];
}

String.prototype.capitalize = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

$(document).ready(() => {
  const stringSingularToPlural = {};
  const stringPluralToSingular = {};

  SINGULAR_PLURAL_STRINGS.forEach(([singular, plural]) => {
    stringSingularToPlural[singular] = plural;
    stringSingularToPlural[singular.capitalize()] = plural.capitalize();
    stringPluralToSingular[plural] = singular;
    stringPluralToSingular[plural.capitalize()] = singular.capitalize();
  });

  String.prototype.singularize = function(number) {
    if (number !== undefined && number !== 1) {
      return this;
    }
    return stringPluralToSingular[this] || this.slice(0, this.length - 1);
  };

  String.prototype.pluralize = function(number) {
    if (number === 1) {
      return this;
    }
    return stringSingularToPlural[this] || this + 's';
  };
});
