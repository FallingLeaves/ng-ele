/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MsiteComponent } from './msite.component';

describe('MsiteComponent', () => {
  let component: MsiteComponent;
  let fixture: ComponentFixture<MsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
