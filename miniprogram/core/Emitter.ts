export type EventType = string | symbol;

// An event handler can take an optional event argument
// and should not return a value
export type Handler<T = any> = (event: T) => void;

// An array of all currently registered event handlers for a type
export type EventHandlerList<T = any> = Array<Handler<T>>;

// A map of event types and their corresponding event handlers.
export type EventHandlerMap<Events extends Record<EventType, any>> = Map<
	keyof Events,
	EventHandlerList<Events[keyof Events]>
>;

// Emitter function type
type IEmitParamType<E extends Record<EventType, any>, K extends keyof E> = 
	E[K] extends ( undefined | void ) ? [type: K] : [type: K, evt: E[K]];

// Mixin to event object
export type EventMixin<A extends Record<EventType, any>, B extends Record<EventType, any>> = {
	[P in (keyof A | keyof B)] :
		P extends (keyof A & keyof B) ? 
			A[P] : 
			P extends keyof A ? 
				A[P] : 
				P extends keyof B ? B[P] : 
			never;
}

export class Emitter<Events extends Record<EventType, any>> {
	
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

	/**
	 * Register an event handler for the given type.
	 * @param {string|symbol} type Type of event to listen for
	 * @param {Function} handler Function to call in response to given event
	 * @memberOf mitt
	 */
	public on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>) {
		const handlers: Array<Handler<Events[Key]>> | undefined = this.all!.get(type);
		if (handlers) {
			handlers.push(handler);
		}
		else {
			this.all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
		}
	}

	/**
	 * Remove an event handler for the given type.
	 * If `handler` is omitted, all handlers of the given type are removed.
	 * @param {string|symbol} type Type of event to unregister `handler` from
	 * @param {Function} [handler] Handler function to remove
	 * @memberOf mitt
	 */
	public off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>) {
		const handlers: Array<Handler<Events[Key]>> | undefined = this.all!.get(type);
		if (handlers) {
			if (handler) {
				handlers.splice(handlers.indexOf(handler) >>> 0, 1);
			}
			else {
				this.all!.set(type, []);
			}
		}
	}

	/**
	 * Invoke all handlers for the given type.
	 *
	 * @param {string|symbol} type The event type to invoke
	 * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
	 * @memberOf mitt
	 */
	public emit<Key extends keyof Events>(...param: IEmitParamType<Events, Key>): this {
		const [ type, evt ] = param;
		let handlers = this.all!.get(type);
		if (handlers) {
			(handlers as EventHandlerList<Events[keyof Events]>)
				.slice()
				.map((handler) => {
					handler(evt!);
				});
		}
		return this;
	}
}