window.BillPinClone = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    BillPinClone.splits = new BillPinClone.Collections.Splits();
    BillPinClone.friends = new BillPinClone.Collections.Friends();

    BillPinClone.friends.fetch({
      async: false,
      success: function (col) {
        BillPinClone.current_user = col.get(options['current_user_id']);
      }
    });

    BillPinClone.splits.fetch({
      success: function () {
        $('#loader').remove();
        new BillPinClone.Routers.AppRouter({
          $rootEl: $("#app")
        });

      Backbone.history.start();
      }
    });
  }
};

Backbone.CompositeView = Backbone.View.extend({

  addSubview: function (selector, subview) {
    var selectorSubviews =
      this.subviews()[selector] || (this.subviews()[selector] = []);

    selectorSubviews.push(subview);
    
    var $selectorEl = this.$(selector);
    $selectorEl.append(subview.$el);
  },

  remove: function () {
    // calls original remove on the parent view
    Backbone.View.prototype.remove.call(this);

    // then removes all subviews from the view
    _(this.subviews()).each(function (selectorSubviews, selector) {
      _(selectorSubviews).each(function (subview) {
        subview.remove();
      });
    });
  },

  removeSubview: function (selector, subview) {
    var selectorSubviews =
      this.subviews()[selector] || (this.subviews()[selector] = []);

    var subviewIndex = selectorSubviews.indexOf(subview);
    selectorSubviews.splice(subviewIndex, 1);
    subview.remove();
  },

  renderSubviews: function () {
    var view = this;

    _(this.subviews()).each(function (selectorSubviews, selector) {
      var $selectorEl = view.$(selector);
      $selectorEl.empty();

      _(selectorSubviews).each(function (subview) {
        $selectorEl.append(subview.render().$el);
        subview.delegateEvents();
      });
    });
  },

  subviews: function () {
    if (!this._subviews) {
      this._subviews = {};
    }
    
    return this._subviews;
  }

});

