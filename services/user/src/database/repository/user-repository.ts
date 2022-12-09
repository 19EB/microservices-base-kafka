class UserRepository {
    // Get user by id
    GetUser = async (data:{id:string}) => {
        return null;
    }
    
    // Get list of users
    GetUsers = async () => {
        return ['some', 'list', 'of', 'users'];
    }
}

export default UserRepository;