/**
 * Observer interface for listening to EventState changes
 */
class Observer {
    /**
     * Update method to be implemented by concrete observers
     * @param {EventState} eventState - The updated event state
     */
    update(eventState) {
        throw new Error("Observer.update() must be implemented by subclasses.");
    }
}

export default Observer;