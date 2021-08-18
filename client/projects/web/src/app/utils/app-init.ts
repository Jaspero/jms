import {Injector} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {INITIAL_STATE} from '../consts/initial-state.const';
import {PAGE_BLACK_LIST} from '../consts/page-black-list.const';

export async function appInit(injector: Injector) {
  let page = location.pathname.split('/')[1];

  if (page === '') {
    page = 'home';
  }

  if (page && !PAGE_BLACK_LIST.includes(page)) {
    const afs = injector.get(AngularFirestore);
    const res = await afs.collection('pages').doc(page).get().toPromise();

    if (res.exists) {
      INITIAL_STATE.collections.pages = {
        [page]: {
          id: page,
          ...res.data() as any
        }
      };
    }
  }
}
