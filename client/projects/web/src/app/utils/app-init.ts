import {Injector} from '@angular/core';
import {Firestore, doc, getDoc} from '@angular/fire/firestore';
import {STATE} from '@jaspero/fb-page-builder';
import {INITIAL_STATE} from '../consts/initial-state.const';
import {PAGE_BLACK_LIST} from '../consts/page-black-list.const';

STATE.renderMode = true;

export async function appInit(injector: Injector) {
  const firestore = injector.get(Firestore);

  let page = location.pathname.split('/')[1];

  if (page === '') {
    page = 'home';
  }

  INITIAL_STATE.layout = (await getDoc(doc(firestore, 'settings', 'layout'))).data() as any;

  if (page && !PAGE_BLACK_LIST.includes(page)) {
    const res = await getDoc(doc(firestore, 'pages', page));

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
