export const environment = {
    // Indica se o ambiente é de produção ou não
    production: false,

    // URL base para o servidor de API local
    endpoint: 'http://localhost:3333',

    /**
     * Rota para autenticação de login
     * Usada para enviar as credenciais do usuário e obter um token de autenticação
     */
    login: '/api/auth/login',

    /**
     * Rota para registro de usuários
     * Usada para criar uma nova conta de usuário
     */
    register: '/api/auth/register',


    /**
     * Rota para obter informações do usuário
     * Usada para recuperar dados do perfil do usuário autenticado
     */
    getUser: '/api/auth/user',

    /**
     * Rota para comentários
     * Usada para criar, atualizar ou obter comentários
     */
    comment: '/api/moments/${id}/comments',
    
    like:'/api/moments/${id}/like',

    getLike:'/api/moments/${id}/like',

    /**
     * Rota para gerenciar 'moments' (momentos)
     * Usada para criar, listar, atualizar ou deletar momentos
     */
    moments: '/api/moments',

    /**
     * Rota para gerenciar 'perfis'
     * Usada para capturar perfis ou atualizar.
     */
    getMyProfile: '/api/profile/me',

    getProfiles:'/api/profile/',

    getProfileId:'/api/profile/${id}',

    updateProfile:'/api/profile/${id}',


    /**
     * Rota para gerenciar 'amigos'
     * Usada para capturar amigos ou atualizar.
     *
     */
    getFriends: '/api/friends',

    getFriendsById: '/api/friends/${id}',

    addFriend: '/api/friends/${id}',
    
    removeFriend: '/api/friends/${id}',

    /**
     * Rota para gerenciar 'chats'
     * Usada para capturar chats ou atualizar.
     */

    getMessagesById: '/api/message/${id}',
    sendMessage: '/api/message/send',

    devicons: 'https://api.github.com/repos/devicons/devicon/contents/icons'
}
