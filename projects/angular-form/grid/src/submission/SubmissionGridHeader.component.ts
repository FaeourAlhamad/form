import {Component} from '@angular/core';
import {Utils, Components} from '@form/js';
import {ExtendedComponentSchema} from '@form/deprecated-types';
import {GridHeaderComponent} from '../GridHeaderComponent';
import {formPromiseService} from '@form/angular';
import {ComponentInstance, formForm} from '@form/angular';
import {GridColumn} from '../types/grid-column';
import {GridHeader, SortType} from '../types/grid-header';

@Component({
  templateUrl: './SubmissionGridHeader.component.html'
})
export class SubmissionGridHeaderComponent extends GridHeaderComponent {

  // Map structure where the key is the path and the value is the component
  formComponents: Map<string, ExtendedComponentSchema>;

  load(form: formPromiseService, query?: any, columns?: Array<GridColumn>) {
    query = query || {};
    return form.loadForm({params: query}).then((form: formForm) => {
      this.headers = [];
      this.formComponents = new Map<string, ExtendedComponentSchema>();
      this.setComponents(form.components);
      columns ? columns.forEach(column => {
          this.setHeader(this.getHeaderForColumn(column, this.formComponents.get(column.path)));
        }) : this.setComponentsHeaders(this.formComponents);

      return this.headers;
    });
  }

  setHeader(header: GridHeader) {
    this.headers.push(header);
  }

  getHeaderForColumn(column: GridColumn, component?: ExtendedComponentSchema, sort?: SortType) {
    return {
      label: column.label,
      key: column.path,
      sort: sort,
      component: component ? Components.create(component, null, null) as ComponentInstance : undefined,
      renderCell: column ? column.renderCell : undefined
    };
  }

  getHeaderForComponent(component: ExtendedComponentSchema, path: string, sort?: SortType) {
    return {
      label: component.label,
      key: path,
      sort: sort,
      component: component ? Components.create(component, null, null) as ComponentInstance : undefined,
    };
  }
  // Set headers from components in case if columns are not provided
  setComponentsHeaders(components: Map<string, ExtendedComponentSchema>, sort?: SortType) {
    components.forEach((component, path) => {
      if (
        component.input &&
        (!component.hasOwnProperty('tableView') || component.tableView)
      ) {
        this.setHeader(this.getHeaderForComponent(component, path, sort));
      }
    });
  }

  // Map components
  setComponents(components) {
    Utils.eachComponent(components, (component: ExtendedComponentSchema, newPath: string) => {
      this.formComponents.set(`data.${newPath}`, component);
    });
  }
}

