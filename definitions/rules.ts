import {firestore, securityRules} from 'firebase-admin';
import {Collections} from './interfaces/collections';
import {MODULES} from './modules/modules';

interface Permission {
	get?: (string | boolean)[],
	list?: (string | boolean)[],
	create?: (string | boolean)[],
	update?: (string | boolean)[],
	delete?: (string | boolean)[]
}

interface Permissions {
	[key: string]: Permission
}

const KEYS = ['get', 'list', 'create', 'update', 'delete'];

const COLLECTIONS: Permissions = {
	_search: {
		get: [false],
		list: [false],
		create: [false],
		update: [false],
		delete: [false]
	},
	storage: {
		get: ['storageItemPublicRead()', 'storageItemPublicWrite()', 'storageItemRoleRead()', 'storageItemRoleWrite()', 'storageItemUserRead()', 'storageItemUserWrite()'],
		list: ['storageItemPublicRead()', 'storageItemPublicWrite()', 'storageItemRoleRead()', 'storageItemRoleWrite()', 'storageItemUserRead()', 'storageItemUserWrite()'],
		create: ['storageItemPublicWrite()', 'storageItemRoleWrite()', 'storageItemUserWrite()'],
		update: ['storageItemPublicWrite()', 'storageItemRoleWrite()', 'storageItemUserWrite()'],
		delete: ['storageItemPublicWrite()', 'storageItemRoleWrite()', 'storageItemUserWrite()'],
	}
};

/**
 * Assigned when nothing else is provided
 * for a collection
 */
const DEFAULT_COLLECTION = () => ({
	get: [false],
	list: [false],
	create: [false],
	update: [false],
	delete: [false]
});

const RULES_BASE = `rules_version = '2';
service cloud.firestore {
  function hasRoles(roles) {
    return request.auth.token.role in roles
  }

  function hasId(resource) {
    return resource.id == request.auth.uid
  }

  function authenticated() {
    return request.auth.token != null;
  }

  function storageItemPublicRead() {
    return 'metadata' in resource.data && resource.data.metadata.keys().hasAny(['permissions_public_read']) && resource.data.metadata['permissions_public_read'] == 'true';
  }

  function storageItemPublicWrite() {
    return 'metadata' in resource.data && resource.data.metadata.keys().hasAny(['permissions_public_write']) && resource.data.metadata['permissions_public_write'] == 'true';
  }

  function storageItemRoleRead() {
    return 'metadata' in resource.data && resource.data.metadata.keys().hasAny(['permissions_roles_' + request.auth.token.role + '_read']) && resource.data.metadata['permissions_roles_' + request.auth.token.role + '_read'] == 'true';
  }

  function storageItemRoleWrite() {
    return 'metadata' in resource.data && resource.data.metadata.keys().hasAny(['permissions_roles_' + request.auth.token.role + '_write']) && resource.data.metadata['permissions_roles_' + request.auth.token.role + '_write'] == 'true';
  }

  function storageItemUserRead() {
    return 'metadata' in resource.data && resource.data.metadata.keys().hasAny(['permissions_users_' + request.auth.uid + '_read']) && resource.data.metadata['permissions_users_' + request.auth.uid + '_read'] == 'true';
  }

  function storageItemUserWrite() {
    return 'metadata' in resource.data && resource.data.metadata.keys().hasAny(['permissions_users_' + request.auth.uid + '_write']) && resource.data.metadata['permissions_users_' + request.auth.uid + '_write'] == 'true';
  }

  match /databases/{database}/documents {
    [[R]]
  }
}`;

export async function compileRules() {
	const fs = firestore();
	const {docs: roleDocs} = await fs.collection(Collections.Roles).get();
	const roles = roleDocs.reduce((acc, cur) => {
		const dt = cur.data();

		if (dt.permissions) {
			acc.push({id: cur.id, permissions: dt.permissions});
		}

		return acc;
	}, []);
	const modules = MODULES.filter(it => !it.id.includes('{'));
	const source = [];

	function formatPermission(permissions: Permission, id: string, key: string) {

		const allowedRoles = roles
			.filter(it => it.permissions[id]?.[key])
			.map(it => it.id);

		if (!permissions[key]) {
			permissions[key] = [];
		}

		if (allowedRoles.length) {
			permissions[key].push(`hasRoles(${JSON.stringify(allowedRoles).replace(/"/g, `'`)})`);
		}

		if (key === 'get') {
			permissions[key].push('hasId(resource)');
		}

		if (permissions[key].some(it => it === true)) {
			permissions[key] = [true];
		}

		if (permissions[key].length > 1) {
			permissions[key] = permissions[key].filter(Boolean);
		}

		if (!permissions[key].length) {
			permissions[key] = [false];
		}

		permissions[key] = permissions[key].join(' || ');
	}

	function formatPermissions(id: string) {
		const collection = COLLECTIONS[id] || DEFAULT_COLLECTION();

		KEYS.forEach(key =>
			formatPermission(collection, id, key)
		);

		source.push(`
			match /${id}/{item=**} {
				${KEYS.map((key, index) => `${index ? '				' : ''}allow ${key}: if ${collection[key]};`).join('\n')}
			}
		`);
	}

	for (const module of modules) {
		const {id} = module;
		formatPermissions(id);
	}

	for (const id in COLLECTIONS) {
		if (modules.some(it => it.id === id)) {
			continue;
		}

		formatPermissions(id);
	}

	const final = RULES_BASE.replace('[[R]]', source.join('\n'));

	console.log('final', final);

	await securityRules().releaseFirestoreRulesetFromSource(final);
}