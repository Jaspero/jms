import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormBuilderComponent, FormBuilderData} from '@jaspero/form-builder';
import {notify} from '@shared/utils/notify.operator';
import {Collections, JSX} from '@definitions';
import {switchMap} from 'rxjs/operators';
import {DbService} from '../../../../../../shared/services/db/db.service';
import {StateService} from '../../../../../../shared/services/state/state.service';

@Component({
  selector: 'jms-profile-information',
  templateUrl: './profile-information.component.html',
  styleUrls: ['./profile-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileInformationComponent implements OnInit {
  constructor(
    private state: StateService,
    private db: DbService
  ) {}

  formData: FormBuilderData;

  ngOnInit() {
    this.formData = {
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
          label: 'NAME'
        },
        profileImage: {
          label: 'PROFILE_IMAGE',
          class: 'profile',
          component: {
            type: 'image',
            configuration: {
              maxSize: 10485760,
              filePrefix: '/users',
              uploadMethods: [{
                id: 'storage',
                label: 'Storage',
                component: JSX(<jms-e-storage-select />),
                configuration: {
                  route: '/users',
                  hidePath: false,
                  filters: [{
                    value: (file) => file.contentType.startsWith('image/')
                  }],
                  allowUpload: false
                }
              }]
            }
          }
        }
      },
      segments: [
        {
          type: 'empty',
          fields: [
            '/name',
            '/profileImage'
          ]
        }
      ]
    };  
  }

  save(form: FormBuilderComponent) {
    return () =>
      form.save(Collections.Users, this.state.user.id)
        .pipe(
          switchMap(() =>
            this.db.setDocument(
              Collections.Users,
              this.state.user.id,
              form.form.getRawValue(),
              {
                merge: true
              }
            )
          ),
          notify({
            success: `Information updated successfully`
          })
        );
  }
}
