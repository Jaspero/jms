import {Injector} from '@angular/core';
import {Firestore, doc, getDoc} from '@angular/fire/firestore';
import {INITIAL_STATE} from '../consts/initial-state.const';
import {PAGE_BLACK_LIST} from '../consts/page-black-list.const';

export async function appInit(injector: Injector) {
  let page = location.pathname.split('/')[1];

  if (page === '') {
    page = 'home';
  }

  if (page && !PAGE_BLACK_LIST.includes(page)) {
    const res = await getDoc(doc(injector.get(Firestore), 'pages', page));

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
