export class Collections {
  static Users = 'users';
  static Roles = 'roles';
	static UserInvites = 'user-invites';
	static Inquiries = 'inquiries';

	static AutomaticEmails = 'automatic-emails';
	static SentEmails = 'sent-emails';

	/**
	 * Shop
	 */
	static Products = 'products';
	static ProductCategories = 'product-categories';
	static ProductTags = 'product-tags';
	static Carts = 'carts';
	static Orders = 'orders';

	/**
	 * Subcollections
	 */
	static History = 'history';
	static Notes = 'notes';

	static HistorySub(collection: string, docId?: string) {
		return `${collection}/${docId || '{docId}'}/${Collections.History}`;
	}

	static get UserHistory() {
		return Collections.HistorySub('users');
	}

	static UserHistorySub(docId: string) {
		return Collections.HistorySub('users', docId);
	}
}