import { Pipe, PipeTransform } from '@angular/core';
import {DriveItem} from 'definitions';
import {StateService} from '../../../../../../shared/services/state/state.service';

@Pipe({
  name: 'folderIcon'
})
export class FolderIconPipe implements PipeTransform {

  constructor(
    private state: StateService
  ) {
  }

  transform(item: DriveItem): string {
    const metadata = item?.metadata || {};
    return Object.keys(metadata).some(key => {

      if (metadata[key] === 'true') {
        return !key.startsWith(`permissions_users_${this.state.user.id}`)
          && (
            key.startsWith('permissions_roles_')
            || key.startsWith('permissions_public_')
            || key.startsWith('permissions_users_')
          );
      }

      return false;
    }) ? 'folder_shared' : 'folder';
  }
}
