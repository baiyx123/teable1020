import { CreatedByDepartmentFieldCore } from '@teable/core';
import { Mixin } from 'ts-mixer';
import { Field } from './field';

export class CreatedByDepartmentField extends Mixin(CreatedByDepartmentFieldCore, Field) {}

