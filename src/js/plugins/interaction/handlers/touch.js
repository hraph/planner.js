(function (Interaction, Events, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.touchPress = function (event) {
    // Start interaction with created objects
    var card = this.createCard(event.srcEvent.target);
    this.planner.drawCard(card);

    // TODO: fix me
    // Utils.index(this) doesn't match strictly domId. After full migration to data-attribute,
    // we can use this value to find the correct domId
    var domId = card.columns[0];
    this.startInteraction('dragCreation', card, this.planner.mapCard.get(card)[domId], Utils.index(event.target), event.srcEvent.touches[0].clientY);
  };

  Mixin.touchMove = function (event) {
    if (this.currentCard !== null) {
      this.resize(event.touches[0].clientY);
      event.preventDefault();
    }
  };

  Mixin.touchEnd = function () {
    Events.publish('cardCreated', [this.currentCard, this.currentElement]);

    this.stopInteraction();
  };

  Mixin.touchTap = function (card, element) {
    var touchEnd = function () {
      Events.publish('cardClicked', [card, element]);
    };

    // Add Hammer.js listener
    var hammer = new Hammer(element);
    hammer.on('tap', touchEnd);
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Events, Planner.Utils);