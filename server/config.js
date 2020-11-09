const config = {
    nodePort: 5000, // port where nodejs run
    clientHost: 'http://localhost', // host that we see at adress bar
    serverHost: 'http://192.168.0.1', // host where our database lives
    databaseLink: '/DATABASE_NAME/hs', // name of our database
    bioSphereAuth: { // robot auth
        auth: {
            username: '',
            password: ''
        }
    }
};

export default config;