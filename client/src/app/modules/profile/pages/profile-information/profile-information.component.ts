import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilderComponent, FormBuilderData} from '@jaspero/form-builder';
import {FirestoreCollection} from '../../../../../../integrations/firebase/firestore-collection.enum';
import {DbService} from '../../../../shared/services/db/db.service';
import {StateService} from '../../../../shared/services/state/state.service';
import {notify} from '../../../../shared/utils/notify.operator';

@Component({
  selector: 'jms-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileInformationComponent {
  constructor(
    private state: StateService,
    private db: DbService
  ) { }

  formData: FormBuilderData = {
    value: this.state.user,
    schema: {
      properties: {
        name: {
          type: 'string'
        },
        profileImage: {
          type: 'string'
        }
      }
    },
    definitions: {
      name: {
        label: 'Name'
      },
      profileImage: {
        label: 'Profile Image',
        class: 'profile',
        component: {
          type: 'image',
          configuration: {
            maxSize: 10485760
          }
        }
      }
    },
    segments: [
      {
        fields: [
          '/name',
          '/profileImage'
        ]
      }
    ]
  };

  save(form: FormBuilderComponent) {
    return () =>
      this.db.setDocument(
        FirestoreCollection.Users,
        this.state.user.id,
        form.form.getRawValue(),
        {
          merge: true
        }
      )
        .pipe(
          notify({
            success: `Information updated successfully`
          })
        )
  }
}
