import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; 

const clientId = "783110912168-24anklkvm8uirb8b4hep113f8gikbkk0.apps.googleusercontent.com"; 

function GLogin() {
    const onSuccess = async (response) =>  {
        const credential = response.credential;
        const user = jwtDecode(credential); 

        const data = await axios.post('https://farmers-social-media-backend.onrender.com/api/googlelogin', {
            email: user.email,
            picture: user.picture,
            email_verified: user.email_verified,
            sub: user.sub,
            username: username,
        });

        localStorage.setItem('authToken', user.jti);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAuth',true);
    
        console.log("Logged in user data:", data);
    };

    const onFailure = (error) => {
        console.error("Login failed", error);
    };

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div id="loginButton">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                />
            </div>
        </GoogleOAuthProvider>
    );
}

export default GLogin;
