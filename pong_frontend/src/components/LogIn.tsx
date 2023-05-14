// import React, {useRef} from 'react';

// interface LogInProps
// {
//   userID_set: React.Dispatch<React.SetStateAction<number>>;
//   loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const LogIn: React.FC<LogInProps> = ({userID_set, loginDone_set}) => {
//   const input_id = useRef<HTMLInputElement>(null);

//   function saveUser_id() : void {
//     if (input_id.current != null)
//     {
//       const parsedInput = parseInt(input_id.current.value);
//       if (!isNaN(parsedInput))
//       {
//         userID_set(parseInt(input_id.current.value));
//         loginDone_set(true);
//       }
//       input_id.current.value = '';
//     }
//   };
//   return (<div>
//             <p>Login or create user.</p>
//             <div>Id number:</div>
//             <input ref={input_id} type="text" />
//             <button onClick={saveUser_id}>Log In</button>
//             <br />
//             <button>Register</button>
//           </div>);
// };

// export default LogIn;



// import React, { useRef } from 'react';
// import useOAuth2 from 'react-oauth2-hook';

// interface LogInProps {
//   userID_set: React.Dispatch<React.SetStateAction<number>>;
//   loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const config = {
//   authorizationUrl: 'https://api.intra.42.fr/oauth/authorize',
//   redirectUri: 'http://localhost:3001',
//   clientId: 'u-s4t2ud-c9dc196ab51fbf188ce86601a58c4464198367598d683ebd15fc307352c076a2',
// };

// const LogIn: React.FC<LogInProps> = ({ userID_set, loginDone_set }) => {
//   const input_id = useRef<HTMLInputElement>(null);
//   const { isFetching, isAuthenticated, clientId } = useOAuth2(config);

//   function saveUser_id(): void {
//     if (input_id.current != null) {
//       const parsedInput = parseInt(input_id.current.value);
//       if (!isNaN(parsedInput)) {
//         userID_set(parseInt(input_id.current.value));
//         loginDone_set(true);
//       }
//       input_id.current.value = '';
//     }
//   }

//   return (
//     <div>
//       <p>Login or create user.</p>
//       {isAuthenticated ? (
//         <p>You are logged in with client ID {clientId}.</p>
//       ) : (
//         <>
//           <div>Id number:</div>
//           <input ref={input_id} type="text" />
//           <button onClick={saveUser_id}>Log In</button>
//           <br />
//           <button>Register</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default LogIn;

// import React, { FunctionComponent, useState } from 'react' 
// import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'; 
// import Alert from 'alert'; 
// import AlertType from 'react-alert'; 

// interface GoogleSignInComponentProps { 
// loginSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void; 
// } 

// export const GoogleSignInComponent: FunctionComponent<GoogleSignInComponentProps> = ({ loginSuccess }) => { 

// const [loginFailed, setLoginFailed] = useState<boolean>(); 

// return ( 
// <div className="text-center mb-4"> 
// <h1 className="h3 mb-3 font-weight-normal">Welcome to Library Portal</h1> 
// {loginFailed && 
// <Alert message="Could not sign you in! Try again." type="error" />// {AlertType.error} /> 
// } 
// <p>Sign In</p> 
// <GoogleLogin 
// clientId={`${process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}`} 
// buttonText='Google' 
// onSuccess={loginSuccess} 
// onFailure={(response: any) => { 
// setLoginFailed(true); 
// }} 
// cookiePolicy={'single_host_origin'} 
// responseType='code,token' 
// /> 
// </div> 
// ) 
// };



import React, { useState } from 'react';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

interface LogInProps {
  userID_set: React.Dispatch<React.SetStateAction<string>>; // number
  loginDone_set: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogIn = ({ userID_set, loginDone_set }: LogInProps) => {
  const [error, setError] = useState("");

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ("code" in response) {
      setError("Login failed.");
      return;
    }

    // Extract user ID and name from response.profileObj
    const userID = response.profileObj.googleId;
    const userName = response.profileObj.name;

    // Store user ID in state and mark the user as logged in
    userID_set(userID);
    loginDone_set(true);

    console.log("Logged in as:", userName);
  };

  const onFailure = () => {
    setError("Login failed.");
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <GoogleLogin
        clientId="594707796484-4b0nt03cegqit632849ioh54phd3kjqa.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default LogIn;
