export const environment = {
    // Indica se o ambiente é de produção ou não
    production: false,

    // URL base para o servidor de API local
    endpoint: 'http://localhost:3333/api',

    /**
     * Rota para autenticação de login
     * Usada para enviar as credenciais do usuário e obter um token de autenticação
     */
    login: '/auth/login',

    /**
     * Rota para registro de usuários
     * Usada para criar uma nova conta de usuário
     */
    register: '/auth/register',


    /**
     * Rota para obter informações do usuário
     * Usada para recuperar dados do perfil do usuário autenticado
     */
    getUser: '/auth/user',

    /**
     * Rota para comentários
     * Usada para criar, atualizar ou obter comentários
     */
    comment: '/moments/${id}/comments',
    
    like:'/moments/${id}/like',

    getLike:'/moments/${id}/like',

    /**
     * Rota para gerenciar 'moments' (momentos)
     * Usada para criar, listar, atualizar ou deletar momentos
     */
    moments: '/moments',

    /**
     * Rota para gerenciar 'perfis'
     * Usada para capturar perfis ou atualizar.
     */
    getMyProfile: '/profile/me',

    getProfiles:'/profile/',

    getProfileId:'/profile/${id}',

    updateProfile:'/profile/${id}',


    /**
     * Rota para gerenciar 'amigos'
     * Usada para capturar amigos ou atualizar.
     *
     */
    getFriends: '/friends',

    getFriendsById: '/friends/${id}',

    addFriend: '/friends/${id}',
    
    removeFriend: '/friends/${id}',
}
