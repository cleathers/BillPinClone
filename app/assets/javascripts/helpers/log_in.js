$(function () {
  var logInOptions = $('#log-in-options');

  if (logInOptions) {
    logInOptions.on('click', function (event) {
      var patt = new RegExp(/(.+)-tab/);
      var newOpts = patt.exec(event.target.id);
      var newOptsA = '#' + newOpts[0];
      var newOptsDiv = '#' + newOpts[1];
      
      var currentActive = logInOptions.find('.active > a');
      var oldOpts = patt.exec($(currentActive)[0].id);
      var oldOptsA = '#' + oldOpts[0];
      var oldOptsDiv = '#' + oldOpts[1];
     
      // changes the anchor tags parent li
      $(oldOptsA).parent().toggleClass('active');
      $(newOptsA).parent().toggleClass('active');
      // changes the current shown log in page
      $(oldOptsDiv).toggleClass('hidden');
      $(newOptsDiv).toggleClass('hidden');

    });
  }
});
