class ViewAudit extends ViewPage {
  static byUrl() {
    if (PATH == 'audit') {
      new ViewAudit().render();
      return true;
    }
    if (PATH == 'audit/children') {
      new ViewAuditChildren().render();
      return true;
    }
  }

  constructor() {
    super();
  }

  render() {
    h1('Audit');

    [
      ['children', 'children'],
    ].forEach(([path, text]) => {
      pg(localLink('audit/' + path, text));
    });
  }
}
