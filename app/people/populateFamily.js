Person.prototype.populateFamily = function() {
  this.forEachRelationship(rel => {
    this[rel] = this[rel] || [];
  });

  const relativeMap = {};

  relativeMap[this._id] = 'root';

  Person.populateList(this.parents);
  Person.populateList(this.spouses);
  Person.populateList(this.children);

  this.parents.forEach(parent => {
    Person.populateList(parent.spouses);
    Person.populateList(parent.children);
    relativeMap[parent._id] = 'parent';
  });

  this.parents.forEach(parent => {
    parent.spouses.forEach(spouse => {
      if (!relativeMap[spouse._id]) {
        if (spouse.death && this.birth
            && isDateBeforeDate(spouse.death.date, this.birth.date)) {
          relativeMap[spouse._id] = 'not-step-parent';
        } else {
          this['step-parents'].push(spouse);
          relativeMap[spouse._id] = 'step-parent';
        }
      }
    });
    parent.children.forEach(sibling => {
      if (relativeMap[sibling._id]) {
        return;
      }

      const fullSiblingsOnly = this.tags['full siblings only']
        || sibling.tags['full siblings only'];

      if (fullSiblingsOnly || (
          this.parents.length == 2 && sibling.parents.length == 2
          && this.parents[0] == sibling.parents[0]
          && this.parents[1] == sibling.parents[1])) {
        this['siblings'].push(sibling);
        relativeMap[sibling._id] = 'sibling';
      } else {
        this['half-siblings'].push(sibling);
        relativeMap[sibling._id] = 'half-sibling';
      }
    });
  });

  this['step-parents'].forEach(parent => {
    Person.populateList(parent.children);
    parent.children.forEach(child => {
      if (!relativeMap[child._id]) {
        this['step-siblings'].push(child);
        relativeMap[child._id] = 'step-sibling';
      }
    });
  });

  this.children.forEach(child => {
    relativeMap[child._id] = 'child';
  });

  this.spouses.forEach(spouse => {
    relativeMap[spouse._id] = 'spouse';
    Person.populateList(spouse.children);
    spouse.children.forEach(child => {
      if (!relativeMap[child._id]) {
        if (this.death && child.birth
            && isDateBeforeDate(this.death.date, child.birth.date)) {
          relativeMap[child._id] = 'not-step-child';
        } else {
          this['step-children'].push(child);
          relativeMap[child._id] = 'step-child';
        }
      }
    });
  });

  [
    'siblings',
    'half-siblings',
    'step-siblings',
    'children',
    'step-children'
  ].forEach(relationship => {
    this[relationship].sortBy(relative => {
      return relative.birth ? relative.birth.date.sort : '3000';
    });
  });
};
