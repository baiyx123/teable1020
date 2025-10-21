import { DepartmentFieldCore } from '@teable/core';
import { Mixin } from 'ts-mixer';
import { Field } from './field';

export class DepartmentField extends Mixin(DepartmentFieldCore, Field) {}

