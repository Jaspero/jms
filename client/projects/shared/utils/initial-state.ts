import {Injector} from '@angular/core';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';
import {INITIAL_STATE} from '../consts/initial-state.const';
import {PAGE_BLACK_LIST} from '../consts/page-black-list.const';
import {LANG_SUFFIX} from '../modules/page/lang-suffix.token';

export async function initialState(injector: Injector) {
  const firestore = injector.get(Firestore);
	const langSuffix = '-' + injector.get(LANG_SUFFIX);

  let page = location.pathname.split('/')[1];

  if (page === '') {
    page = 'home';
  }

  INITIAL_STATE.layout = (await getDoc(doc(firestore, 'settings', 'layout' + langSuffix))).data() as any;

  if (page && !PAGE_BLACK_LIST.includes(page)) {
    const res = await getDoc(doc(firestore, 'pages' + langSuffix, page));

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