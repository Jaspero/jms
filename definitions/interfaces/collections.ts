export class Collections {
	static Modules = 'modules';
  static Settings = 'settings';
  static Users = 'users';
  static Roles = 'roles';
	static UserInvites = 'user-invites';

	/**
	 * Subcollections
	 */
	static History = 'history';

	static HistorySub(collection: string, docId?: string) {
		return `${collection}/${docId || '{{docId}}'}/${Collections.History}`;
	}

	static get UserHistory() {
		return Collections.HistorySub('users');
	}

	static UserHistorySub(docId: string) {
		return Collections.HistorySub('users', docId);
	}
}