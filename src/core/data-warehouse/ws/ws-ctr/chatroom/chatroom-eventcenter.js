/*
 * @Description:
 */
export default class ChatroomEventCenter {

  eventStack = {};

  constructor() {
    this.eventStack = {};
  }

  on(eventName, cb) {
    const eventValue = this.eventStack[eventName];
    // 一个事件可以订阅多个回调函数
    eventValue ? eventValue.push(cb) : this.eventStack[eventName] = [cb];
  }

  off(eventName, cb) {
    const eventValue = this.eventStack[eventName];
    if (!eventValue) return;

    (eventValue || []).forEach((eventCb, index) => {
      if (eventCb === cb) {
        eventValue.splice(index, 1);
      }
    })
  }

  emit(eventName, data) {
    const eventValue = this.eventStack[eventName];

    if (!eventValue) return;

    (eventValue || []).forEach(eventCb => {
      eventCb(data);
    })
  }
}
