// for dismissal of alerts
$(function () {
  var flash_message = $('div.alert');
  if (flash_message) {
    $('.close').on('click', function (event) {
      $(event.currentTarget.parentElement).remove();
    });
  }
});
