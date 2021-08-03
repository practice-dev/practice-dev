import { StepNotifier } from '../types';

export class TestNotifier implements StepNotifier {
  actions: any[] = [];

  async notify(text: string, data?: any) {
    if (data) {
      this.actions.push({ text, data });
    } else {
      this.actions.push(text);
    }
  }
}
