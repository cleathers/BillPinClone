BillPinClone.Views.SplitForm = Backbone.CompositeView.extend({

  initialize: function (options) {
  },

  attributes: {
    'id': 'split-form'
  },

  events: {
    'click .pointer': 'changePayer'
  },

  template: JST['splitForm'],

  changePayer: function (event) {
    this.$el.find('.pointer').each(function (idx, el) {
      $(el).toggleClass('hidden');
    });
    this.$el.find('#split-payer').first().toggleClass('hidden');
  },


  render: function () {
    this.$el.html(this.template({
      users: BillPinClone.friends,
      current_user: BillPinClone.current_user
    }));
    this.renderSubviews();
    return this;
  }

});
