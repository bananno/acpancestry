class ViewAudit extends ViewPage {
  static byUrl() {
    if (PATH == 'audit') {
      new ViewAudit().render();
      return true;
    }
  }

  constructor() {
    super();
  }

  render() {
    h1('Audit');
  }
}
