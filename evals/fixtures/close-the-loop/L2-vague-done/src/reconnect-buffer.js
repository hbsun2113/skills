export class ReconnectBuffer {
  constructor(send) {
    this.send = send;
    this.connected = true;
  }

  emit(chunk) {
    if (!this.connected) return;
    this.send(chunk);
  }

  disconnect() {
    this.connected = false;
  }

  reconnect(send) {
    this.send = send;
    this.connected = true;
  }
}
