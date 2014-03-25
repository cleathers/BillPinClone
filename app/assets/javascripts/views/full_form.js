BillPinClone.Views.FullForm = Backbone.View.extend({
  
  template: JST['fullForm'],
  userTemplate: JST['fullForm_userSplit'],
  className: 'row',

  initialize: function (options) {
    BillPinClone.friends.fetch();
  },
  
  events: {
    'click .user-list li': 'addUserToSplit',
    'click #split-by-amount': 'openSplits',
    'click #shared-equally': 'shareEqually',
    'click .close': 'removeUserFromSplit',
    'submit form': 'buildSplit'
  },

  attributes: {
    'id': 'full-form'
  },

  render: function () {
    var payerId = $('#split-payer').val()
    this.$el.html(this.template({
      current_user: BillPinClone.current_user,
      users: BillPinClone.friends,
      splitAmt: $('#split-amt').val(),
      value: $('#split-amt').val(),
      splitDes: $('#split-des').val(),
      payerId: payerId,
      payerEmail: BillPinClone.friends.get(payerId).get('email')
    }));
    
    return this;
  },

  addUserToSplit: function (event) {
    var userId = event.currentTarget.dataset.id;
    $(event.currentTarget).remove();
    var content = this.userTemplate({
      user: BillPinClone.friends.get(userId),
      numUsers: ($('.user-split-details').length)
    });

    $('.user-split-details').last().after(content);
    if (this.$el.find('#split-by-amount').hasClass('active')) {
      this.openSplits();
    }

    this.setValues();
  },

  adjustValues: function (event) {
    
  },

  buildSplit: function (event) {
    event.preventDefault();
    var formData = $(event.target).serializeJSON().split;
    debugger

    // run a fetch so the other view which isn't even displayed at this point will update.
    BillPinClone.splits.create(formData, {wait: true});
    BillPinClone.splits.fetch();
  },

  changePayer: function (event) {
    var payerId = $(event.target).val();
    var newPayer = BillPinClone.friends.get(payerId);
    $('#split-payer-input').attr('value', payerId);
    $('#split-payer-display').html(newPayer.escape('email') + ' paid');
  },

  openSplits: function (event) {
    if (event) {
      this.$el.find('#shared-equally').removeClass('active');
      $(event.currentTarget).addClass('active');
    }

    // changes hidden inputs to text fields
    this.$el.find('.user-split').each(function (idx, userInput) {
      $(userInput).attr('type', 'input');
    });
    // hides ps from DOM
    this.$el.find('.split-amt-display').each(function(idx, userInput) {
      $(userInput).addClass('hidden');
    });
    this.setValues();
  },

  renderPrev: function (event) {
    var input = event.currentTarget
    var preview = '#' + input.id + '-prev';
    var hiddenInput = '#' + input.id + '-hidden';

    $(hiddenInput).attr('value', input.value);
    $(preview).html(input.value);
  },

  removeUserFromSplit: function (event) {
    event.preventDefault;
    var userId = event.currentTarget.parentNode.dataset.id;
    $(event.currentTarget.parentNode.parentNode.parentNode).remove();
    debugger
    var $li = $('<li>');
    $li.attr('data-id', userId);
    $a = $('<a>')
    $a.html(BillPinClone.friends.get(userId).get('email'));
    $li.append($a);

    $('.user-list').append($li);
    this.setValues();
  },

  setValues: function () {
    var totalVal = $('#split-amt').val();
    var users = $('.user-split-details');
    
    var splitAmt = (totalVal / users.length).toFixed(2);
    _.each(users, function (user) {
      // the folowing two lines produced the same effect
      // $(user).find('.split-amt').removeAttr('value');
      // $(user).find('.split-amt').attr('value', splitAmt);
      $(user).find('.split-amt').val(splitAmt);

      $(user).find('.split-amt-display').html('$ '+splitAmt);
    });
  },

  shareEqually: function (event) {
    this.$el.find('#split-by-amount').removeClass('active');
    $(event.currentTarget).addClass('active');
    // finds text inputs, switches them to hidden
    this.$el.find('.user-split').each(function (idx, userInput) {
      $(userInput).attr('type', 'hidden');
    });

    // reshows p tags
    this.$el.find('.split-amt-display').each(function(idx, userInput) {
      $(userInput).removeClass('hidden');
    });
    this.setValues();
  }

});
