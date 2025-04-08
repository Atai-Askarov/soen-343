import Permission from './Permission.js';

// Create a dummy permission object. Delete this later, only for testing
const dummyPermission = new Permission(
    'ManageEvents',
    'Allows the admin to create, update, and delete events.'
);

export default dummyPermission;