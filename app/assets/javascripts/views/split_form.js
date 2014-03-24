BillPinClone.Views.SplitForm = Backbone.CompositeView.extend({

  initialize: function (options) {
    this.listenTo(BillPinClone.friends, 'sync', this.render);
  },

  attributes: {
    'id': 'split-form'
  },

  template: JST['splitForm'],


  render: function () {
    this.$el.html(this.template({
      users: BillPinClone.friends
    }));
    this.renderSubviews();
    return this;
  }

});
