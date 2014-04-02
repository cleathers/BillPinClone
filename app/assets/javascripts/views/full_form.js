BillPinClone.Views.FullForm = Backbone.View.extend({
  
  template: JST['fullForm'],
  userTemplate: JST['fullForm_userSplit'],

  initialize: function (options) {
    BillPinClone.friends.fetch();
    this.listenTo(BillPinClone.friends, 'sync', this.render);
  },
  
  events: {
    'click .user-list': 'getUser',
    'click #split-by-amount': 'openSplits',
    'click #shared-equally': 'shareEqually',
    'click .close': 'removeUserFromSplit',
    'change #split-receipt': 'handleFile',
    'keyup .split-amt': 'checkAmounts',
    'submit form': 'buildSplit'
  },

  attributes: {
    'id': 'full-form'
  },

  render: function () {
    var payerId = $('#split-payer').val();
    var splitAmt = $('#split-amt').val();
    var totalAmt = $('#split-amt').val();

    if (parseInt(payerId) == BillPinClone.current_user.id) {
      var payerEmail = 'I'
    } else {
      var newPayer = BillPinClone.friends.get(payerId);
      if (newPayer) {
        var payerEmail = newPayer.escape('email');
      }
    }

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
      payerEmail: payerEmail
    }));

    if (newPayer) {
      this.addUserToSplit(payerId);
      this.removeUserFromUsersList(payerId);
    }
    
    return this;
  },

  getUser: function (event) {
    var userId = event.target.parentElement.dataset.id;

    this.removeUserFromUsersList(userId);
    this.addUserToSplit(userId);
  },

  addUserToSplit: function (userId) {
    // emptys out warnings label
    $('#warnings').empty();

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
    $('.btn-orange.glyphicon-pin').addClass('spinner');
    if (this.checkValid()) {
      var formData = $(event.target).serializeJSON().split;
      formData['receipt_photo'] = this._splitPic;

      BillPinClone.splits.create(formData, {
        wait: true,
        success: function (model) {
          var route = 'split/' + model.id;
          Backbone.history.navigate(route, {trigger: true});
        }
      });
    }
  },

  changePayer: function (event) {
    var payerId = $(event.target).val();
    debugger
    if (parseInt(payerId) == BillPinClone.current_user.id) {
      $('#split-payer-display').html('I paid');
    } else {
      var newPayer = BillPinClone.friends.get(payerId);
      $('#split-payer-display').html(newPayer.escape('email') + ' paid');
    }

    $('#split-payer-input').attr('value', payerId);
  },

  checkValid: function (event) {
    if ($('.user-split-details').length == 1) {
      $('#warnings').html('Sorry, we can\'t split a bill between one person');
      return false;
      
    } else if ( $('#split-amt').val() == '' ){
      $('#warnings').html('Did you mean to enter an amount?');
      return false;

    } else if ( isNaN($('#split-amt').val())) {
      $('#warnings').html('Please enter a number');
      return false;
      
    } else if (parseFloat($('#split-amt').val()).toFixed(2) == '0.00') {
      $('#warnings').html('Sorry, we can\'t split 0');
      return false;
    }

    return true;
  },

  checkAmounts: function () {
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
    $(preview).text(value);
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

  removeUserFromUsersList: function(userId) {
    $('.user-list').find("li[data-id=" + userId + "]").remove();
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
    this.checkAmounts();
  }

});
