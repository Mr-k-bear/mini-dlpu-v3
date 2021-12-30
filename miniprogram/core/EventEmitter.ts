export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (
	type: keyof T,
	event: T[keyof T]
) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = unknown> = Array<Handler<T>>;
export type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
	keyof Events | '*',
	EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>
>;

type GenericEventHandler<Events extends Record<EventType, unknown>> =
	| Handler<Events[keyof Events]>
	| WildcardHandler<Events>;

export class EventEmitter<Events extends Record<EventType, unknown>> {
	
	/**
	 * A Map of event names to registered handler functions.
	 */
	public all: EventHandlerMap<Events>;

	public constructor() {
		this.all = new Map();
	}

	public resetAll() {
		this.all = new Map();
	}

	public reset<Key extends keyof Events>(type: Key) {
		this.all!.set(type, [] as EventHandlerList<Events[keyof Events]>);
	}

	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
	on(type: '*', handler: WildcardHandler<Events>): void;

	/**
	 * Register an event handler for the given type.
	 * @param {string|symbol} type Type of event to listen for, or `'*'` for all events
	 * @param {Function} handler Function to call in response to given event
	 * @memberOf mitt
	 */
	public on<Key extends keyof Events>(type: Key, handler: GenericEventHandler<Events>) {
		const handlers: Array<GenericEventHandler<Events>> | undefined = this.all!.get(type);
		if (handlers) {
			handlers.push(handler);
		}
		else {
			this.all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
		}
	}

	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
	off(type: '*', handler: WildcardHandler<Events>): void;

	/**
	 * Remove an event handler for the given type.
	 * If `handler` is omitted, all handlers of the given type are removed.
	 * @param {string|symbol} type Type of event to unregister `handler` from, or `'*'`
	 * @param {Function} [handler] Handler function to remove
	 * @memberOf mitt
	 */
	public off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler<Events>) {
		const handlers: Array<GenericEventHandler<Events>> | undefined = this.all!.get(type);
		if (handlers) {
			if (handler) {
				handlers.splice(handlers.indexOf(handler) >>> 0, 1);
			}
			else {
				this.all!.set(type, []);
			}
		}
	}

	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
	emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;

	/**
	 * Invoke all handlers for the given type.
	 * If present, `'*'` handlers are invoked after type-matched handlers.
	 *
	 * Note: Manually firing '*' handlers is not supported.
	 *
	 * @param {string|symbol} type The event type to invoke
	 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
	 * @memberOf mitt
	 */
	emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
		let handlers = this.all!.get(type);
		if (handlers) {
			(handlers as EventHandlerList<Events[keyof Events]>)
				.slice()
				.map((handler) => {
					handler(evt!);
				});
		}

		handlers = this.all!.get('*');
		if (handlers) {
			(handlers as WildCardEventHandlerList<Events>)
				.slice()
				.map((handler) => {
					handler(type, evt!);
				});
		}
	}
}