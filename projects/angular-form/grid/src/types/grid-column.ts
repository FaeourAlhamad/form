import { ComponentInstance } from '@form/angular';

export interface GridColumn {
  label?: string;
  path: string;
  renderCell?(cellValue: any, component?: ComponentInstance): string;
}
