module.exports = function Queue() {
    this.queue = []
    this.enqueue = function (element) {
        this.queue = [element, ...queue]
    }
    this.dequeue = function () {
        if (this.queue.length === 0)
            throw 'EmptyQueue'
        return this.queue.pop()
    }
    this.getLength = function () {
        return this.queue.length
    }
    this.findAndRemove = function (el) {
        let indexOf = this.queue.indexOf(el)
        if (indexOf > -1) {
            this.queue.splice(indexOf, 1)
        } else
            throw 'NotFoundInQueue'
    }
    this.exists = function (el) {
        return this.queue.includes(el)
    }
    this.getArray = function() {
        return this.queue
    }
}