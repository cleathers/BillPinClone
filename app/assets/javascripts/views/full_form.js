BillPinClone.Views.FullForm = Backbone.View.extend({
  
  template: JST['fullForm'],
  userTemplate: JST['fullForm_userSplit'],
  className: 'row',
  
  events: {
    'click .user-list li': 'addUserToSplit',
    'submit form': 'buildSplit'
    
  },

  attributes: {
    'id': 'full-form'
  },

  render: function () {
    this.$el.html(this.template({
      current_user: BillPinClone.current_user,
      users: BillPinClone.friends,
      splitAmt: $('#split-amt').val(),
      value: $('#split-amt').val(),
      splitDes: $('#split-des').val()
    }));
    
    return this;
  },

  addUserToSplit: function (event) {
    var userId = event.currentTarget.dataset.id;
    $(event.currentTarget).remove();
    var content = this.userTemplate({
      user: BillPinClone.friends.get(userId)
    });

    $('.user-split-details').last().after(content);
    this.setValues();
  },

  adjustValues: function (event) {
    
  },

  buildSplit: function (event) {
    event.preventDefault();

    // run a fetch so the other view which isn't even displayed at this point will update.
    BillPinClone.splits.create(formData, {wait: true});
    BillPinClone.splits.fetch();
  },

  renderPrev: function (event) {
    var input = event.currentTarget
    var preview = '#' + input.id + '-prev';
    var hiddenInput = '#' + input.id + '-hidden';

    $(hiddenInput).attr('value', input.value);
    $(preview).html(input.value);
  },

  setValues: function () {
    var totalVal = $('#split-amt').val();
    var users = $('.user-split-details');
    
    var splitAmt = (totalVal / users.length).toFixed(2);
    _.each(users, function (user) {
      $(user).find('.split-amt').attr('value', splitAmt);
      $(user).find('.split-amt-display').html('$ '+splitAmt);
    });
  }

});