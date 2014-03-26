BillPinClone.Views.ShowSplit = Backbone.View.extend({
  
  initialize: function (options) {
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(BillPinClone.friends, 'sync', this.render);
  },

  template: JST['show_split'],

  render: function () {
    var view = this;

    debugger
    // sets split to similar objs. depending up whether it came from the db or a redirect
    if (view.model.attributes.split) {
      var split = view.model.attributes.split;
      var receipt_photo = view.model.attributes.receipt_photo;
    } else if ( view.model.attributes.payerId ) {
      var split = view.model.attributes;
      var receipt_photo = view.model.attributes.receipt_photo;
    }

    var renderedContent = view.template({
      split: split,
      users: view.model.attributes.users,
      receipt_photo: receipt_photo
    });

    view.$el.html(renderedContent);
    return view;
  },


  calcTotal: function (userSplits) {
    var total = 0;
    _.each(userSplits, function (split) {
      total += parseInt(split.get('amt'));
    });
    return total; 
  },

  getPayer: function (userSplits) {
    var payer = _.find(userSplits, function (split) {
          if (split.get('split_type') == 'positive') {
            return split;
          }
        });
    return payer;
  }

});
