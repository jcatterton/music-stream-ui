import { SecurePipe } from './secure.pipe';
import { HttpClient, HttpXhrBackend } from "@angular/common/http";

describe('SecurePipe', () => {
  it('create an instance', () => {
    const pipe = new SecurePipe(new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() })), null);
    expect(pipe).toBeTruthy();
  });
});
