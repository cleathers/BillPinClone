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
    'change #split-receipt': 'handleFile',
    'keyup .split-amt': 'checkValid',
    'submit form': 'buildSplit'
  },

  attributes: {
    'id': 'full-form'
  },

  render: function () {
    var payerId = $('#split-payer').val();
    var splitAmt = $('#split-amt').val();
    var totalAmt = $('#split-amt').val();

    if (isNaN(splitAmt) || !splitAmt) {
      splitAmt = parseFloat('0');
      totalAmt = parseFloat('0');
    }

    this.$el.html(this.template({
      current_user: BillPinClone.current_user,
      users: BillPinClone.friends,
      splitAmt: parseFloat(totalAmt).toFixed(2),
      value: parseFloat(splitAmt).toFixed(2),
      splitDes: $('#split-des').val(),
      payerId: payerId,
      payerEmail: BillPinClone.friends.getOrFetch(payerId).get('email')
    }));
    
    return this;
  },

  addUserToSplit: function (event) {
    // emptys out warnings label
    $('#warnings').empty();

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

  buildSplit: function (event) {
    event.preventDefault();
    if ($('.user-split-details').length == 1) {
      $('#warnings').html('Sorry, you can\'t post a split with just yourself');
    } else {
      var formData = $(event.target).serializeJSON().split;
      formData['receipt_photo'] = this._splitPic;


      // run a fetch so the other view which isn't even displayed at this point will update.
      BillPinClone.splits.create(formData, {wait: true});
      BillPinClone.splits.fetch();
    }
  },

  changePayer: function (event) {
    var payerId = $(event.target).val();
    var newPayer = BillPinClone.friends.get(payerId);
    $('#split-payer-input').attr('value', payerId);
    $('#split-payer-display').html(newPayer.escape('email') + ' paid');
  },

  checkValid: function (event) {
    this.checkUserInputs();
  },

  checkUserInputs: function () {
    var splitAmts = $('.split-amt');
    var totalAmt = $('#split-amt').val();
    var total = parseFloat(0);
    _.each(splitAmts, function (amt) {
      total += parseFloat(amt.value);
    });
    if ( totalAmt && totalAmt != 0 ) { 
      if ( parseFloat(total).toFixed(2) != parseFloat(totalAmt).toFixed(2) ) {
        $('#submit-button').addClass('disabled');
        $('#warnings').html('User amounts must equal total!');
      } else {
        $('#submit-button').removeClass('disabled');
        $('#warnings').empty();
      }
    }
  },

  handleFile: function (event) {
    var view = this;
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      view._splitPic = e.target.result
    }

    reader.readAsDataURL(file);
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
    var input = event.currentTarget;
    var preview = '#' + input.id + '-prev';
    var hiddenInput = '#' + input.id + '-hidden';
    var value = input.value;

    if (input.id == 'split-amt') {
      value = parseFloat(value).toFixed(2);
      if (isNaN(value)) {
        value = parseFloat('0').toFixed(2);
      }
    }

    $(hiddenInput).attr('value', value);
    $(preview).html(value);
  },

  removeUserFromSplit: function (event) {
    event.preventDefault();
    var userId = event.currentTarget.parentNode.dataset.id;
    $(event.currentTarget.parentNode.parentNode.parentNode).remove();

    var $li = $('<li>');
    $li.attr('data-id', userId);
    $a = $('<a>');
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
