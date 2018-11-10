

var behavior = (function DomBehaviorModule() {
	function _registerBehavior(selector, eventsForThis){
		if (arguments.length === 3) return _registerEventBehavior(arguments[0], arguments[1], arguments[2]);

		var subscribes = eventsForThis();

		if (typeof subscribes === 'function') {
			subscribes = {create: subscribes};
		}


		$.each(subscribes, function (eventType, eventAction) {
			_registerEventBehavior(eventType, selector, eventAction);
		});
	}

	function _registerEventBehavior(eventType, selector, action) {
		if (!eventType in _registerBehavior.behaviors) {
			throw new Error("flux.behavior: Unsupported event type `%s`".replace('%s', eventType))
		}
		var behavior = {
			selector: selector,
			action: action,
		}

		_registerBehavior.behaviors[eventType].push(behavior);
	}


	// behaviors [ eventType => [ behavior objects ] ]
	_registerBehavior.behaviors = {
		click: [],
		create: [],
		destroy: []
	};

	var eventHandlerBehaviour = ['click'];

	if (!_registerBehavior.wasInitialized) {
		_registerBehavior.wasInitialized = true;

		eventHandlerBehaviour.forEach(function (eventType) {
			var behaviors = _registerBehavior.behaviors[eventType];

            document.addEventListener(eventType, eventHandler);

			function eventHandler(event) {
				for (let behavior of behaviors) {
                    var target = event.target;

                    // Target === item
					if (target.matches(behavior.selector)) {
                        target = event.target;
                    } else if (target.matches(behavior.selector + ' *')) {
                        // Target is contained by item -> Find target
                        while(target && (target = target.parentNode)) {
                            if (target.match(behavior.selector)) {
                                break;
                            }
                        }
                    } else {
                        // skip
                        break;
                    }
                    
                    // assume we have target.
                    var result = behavior.action.apply(target, [event]);
                    if (result === false || event.defaultPrevented) {
                        // Stop running events.
                        break;
                    }
                    
				}
			}
		})


		function createDomEventHandler(behaviorName) {
			return function domEventHandler(event) {

				var behaviors = _registerBehavior.behaviors[behaviorName];

                for (let rec of event) {
                    for (let node of rec.addedNodes) {
                        for (let behavior of behaviors) {
                            var sel = [];
                            if (node.matches(behavior.selector)) {
                                sel = [node];
                            } else {
                                sel = node.querySelectorAll(behavior.selector);
                            }

                            if (sel.length == 0) {
                                continue;
                            }

                            [].forEach.call(sel, function (sub) {
                                // console.log(sub, 'selected node');
                                behavior.action.apply(sub);					

                            })
                        }
                    }
                }
			}
		}

		// create behavior

        var createdHandler = createDomEventHandler('create');
        
        var mo = new MutationObserver(createdHandler)

        document.addEventListener('DOMContentLoaded', event => {
            mo.observe(document.body, {attributes: false, childList: true, subtree: false});
        })
	}

	return _registerBehavior
})();

window.behavior = behavior;