import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorTrabajadorComponent } from './gestor-trabajador.component';

describe('GestorTrabajadorComponent', () => {
  let component: GestorTrabajadorComponent;
  let fixture: ComponentFixture<GestorTrabajadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestorTrabajadorComponent]
    });
    fixture = TestBed.createComponent(GestorTrabajadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
