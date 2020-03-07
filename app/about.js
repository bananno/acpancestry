
class ViewAbout extends ViewPage {
  static load(params) {
    return false;
  }
}

class ViewAboutPersonProfile extends ViewPage {
  static load(params) {
    setPageTitle('About Person Profile');
    rend(`
      <h1>About Person Profile</h1>
      <p style="margin-top: 20px;">
        Every person in the database has a profile page.
      </p>
      <p style="margin-top: 10px;">
        Below is an explanation of the information you will find on a profile page.
      </p>
      <h2>Biography</h2>
      <p>
      </p>
      <h2>Family</h2>
      <p>
        This section will show a list of the person's immediate family members. Click any family
        member to view their profile.
      </p>
      <h2>Tree</h2>
      <p>
        This section will show a diagram of all of the person's ancestors in the database. Click
        any ancestor member to view their profile.
      </p>
      <div id="example-tree"></div>
      <h2>Links</h2>
      <p>
        This section will include a list of external links to this person's profile on various
        genealogy websites. Some sites require you to log in before viewing the profile.
      </p>
      <h2>Timeline</h2>
      <p>
      </p>
      <h2>Citations</h2>
      <p>
      </p>
    `);

    $('#example-tree').append('insert tree');
  }
}
